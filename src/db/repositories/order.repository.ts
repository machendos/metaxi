import knex from '.././knex';
import {
  ClientStatuses,
  DriverStatuses,
  OrderStatuses,
} from '../../helpers/enums';
import {
  ChangeOrderStatusResult,
  Client,
  Driver,
  NewOrder,
} from './../../modules/orders/dto';
import { Injectable } from '@nestjs/common';

const MILISECONDS_IN_SECOND = 1000;

@Injectable()
export class OrdersRepository {
  takeFreeDriver(): Promise<Driver> {
    return knex.transaction(trx =>
      trx
        .from<Driver>('driver')
        .select('driverId', 'driverName', 'status')
        .where({ status: DriverStatuses.Free })
        .limit(1)
        .then(drivers => {
          if (drivers.length) {
            const driver = drivers[0];
            return trx('driver')
              .where({ driverId: driver.driverId })
              .update({ status: DriverStatuses.TookOrder })
              .then(() => driver);
          }
        }),
    );
  }

  checkPoint(pointId: number): Promise<boolean> {
    return knex
      .from('point')
      .select('pointId')
      .where({ pointId })
      .then(points => !!points.length);
  }

  checkClient(clientId: number): Promise<Client> {
    return knex
      .from('client')
      .select('clientId', 'status')
      .where({ clientId })
      .then(clients => clients[0]);
  }

  occupyClient(clientId: number): Promise<boolean> {
    return knex.transaction(trx =>
      trx
        .from<Client>('client')
        .select('clientId', 'status')
        .where({ clientId })
        .then(clients => {
          if (clients.length) {
            const client = clients[0];
            console.log(client);
            if (client.status !== ClientStatuses.Free) return false;
            return trx('client')
              .where({ clientId })
              .update({ status: ClientStatuses.WaitForDriver })
              .then(() => true);
          }
        }),
    );
  }

  freeDriver(driverId: number): Promise<boolean> {
    return knex('driver')
      .where({ driverId })
      .update({ status: DriverStatuses.Free })
      .then(() => true);
  }

  freeClient(clientId: number): Promise<boolean> {
    return knex('client')
      .where({ clientId })
      .update({ status: ClientStatuses.Free })
      .then(() => true);
  }

  createOrder(
    driverId: number,
    fromPointId: number,
    toPointId: number,
    clientId: number,
    orderStartTime: Date = null,
    duration: Date = null,
    cost: number = null,
    status: OrderStatuses = OrderStatuses.New,
  ) {
    return knex('order')
      .insert({
        driverId,
        fromPointId,
        toPointId,
        orderStartTime,
        duration,
        cost,
        status,
        clientId,
      })
      .returning('orderId')
      .then(orderId => orderId[0]);
  }

  checkAndChangeOrderStatus(
    orderId: number,
    expectedOldStatus: OrderStatuses,
    newStatus: OrderStatuses,
  ): Promise<ChangeOrderStatusResult> {
    return knex.transaction(trx =>
      trx
        .from('order')
        .select('orderId', 'status', 'driverId', 'orderId', 'clientId')
        .where({ orderId })
        .then(orders => {
          if (!orders.length) return { order: false };
          const oldStatus = orders[0].status as OrderStatuses;
          if (oldStatus === expectedOldStatus) {
            return trx('order')
              .where({ orderId })
              .update({ status: newStatus })
              .then(() => ({
                order: true,
                done: true,
                oldStatus,
                driverId: orders[0].driverId,
                orderId: orders[0].orderId,
                clientId: orders[0].clientId,
              }));
          }
          return { order: true, done: false, oldStatus };
        }),
    );
  }

  setOrderStartTime(orderId: number, orderStartTime: Date) {
    return knex('order')
      .where({ orderId })
      .update({ orderStartTime });
  }

  setOrderDuration(orderId: number, orderFinishTime: Date): Promise<number> {
    return knex.transaction(trx =>
      trx('order')
        .where({ orderId })
        .select('orderStartTime')
        .then(orders => orders[0].orderStartTime)
        .then(orderStartTime => {
          const duration = orderFinishTime.getTime() - orderStartTime.getTime();
          return trx('order')
            .where({ orderId })
            .update({ duration: new Date(duration) })
            .then(() => duration / MILISECONDS_IN_SECOND);
        }),
    );
  }

  setOrderCost(orderId: number, cost: number) {
    return knex('order')
      .where({ orderId })
      .update({ cost });
  }
}
