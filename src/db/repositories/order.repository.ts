import knex from '.././knex';
import { ClientStatuses, DriverStatuses, OrderStatuses } from './../enums';
import { Client, Driver } from './../../modules/orders/dto';
import { Injectable } from '@nestjs/common';

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

  createOrder(
    driverId: number,
    fromPointId: number,
    toPointId: number,
    orderStartTime: Date,
    clientId: number,
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
}
