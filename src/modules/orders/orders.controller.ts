import { Controller, Post, Body } from '@nestjs/common';
import { CreatedOrder, MetaxiError, NewOrder, OrderId } from './dto';
import { errors, createError } from './../../helpers/errors';
import { OrdersRepository } from '../../db/repositories/order.repository';
import { ClientStatuses, OrderStatuses } from 'src/helpers/enums';
import validatorAPI from '../../helpers/validator';

const ONE_SECOND_PRICE = 0.01;

@Controller('order')
export class OrdersController {
  constructor(private ordersRepository: OrdersRepository) {}
  @Post()
  async createOrder(@Body() body): Promise<CreatedOrder | MetaxiError> {
    const order = new NewOrder(body.clientId, body.fromId, body.toId);
    return await validatorAPI(order)
      .then(() => this.ordersRepository.checkPoint(order.fromId))
      .then(pointFinded => {
        if (!pointFinded)
          throw createError(errors.DepartureNotFound, order.fromId);
      })
      .then(() => this.ordersRepository.checkPoint(order.toId))
      .then(pointFinded => {
        if (!pointFinded)
          throw createError(errors.DestinationNotFound, order.toId);
      })
      .then(() => this.ordersRepository.checkClient(order.clientId))
      .then(clientFinded => {
        if (!clientFinded)
          throw createError(errors.ClientNotFound, order.clientId);
        console.log(clientFinded);
        if (clientFinded.status !== ClientStatuses.Free)
          throw createError(errors.ClientAlreadyMadeOrder, order.clientId);
      })
      .then(() => this.ordersRepository.takeFreeDriver())
      .then(driver => {
        if (!driver) throw createError(errors.NoFreeDrivers);

        return this.ordersRepository
          .occupyClient(order.clientId)
          .then(success => {
            if (!success) {
              this.ordersRepository.freeDriver(driver.driverId);
              throw createError(errors.ClientAlreadyMadeOrder, order.clientId);
            }
          })
          .then(() =>
            this.ordersRepository
              .createOrder(
                driver.driverId,
                order.fromId,
                order.toId,
                order.clientId,
              )
              .then(orderId => new CreatedOrder(orderId, driver.driverId)),
          );
      })
      .catch(error => error);
  }

  @Post('start')
  async startOrder(@Body() body) {
    const orderId = new OrderId(parseInt(body.orderId));
    return await validatorAPI(orderId)
      .then(() =>
        this.ordersRepository.checkAndChangeOrderStatus(
          orderId.orderId,
          OrderStatuses.New,
          OrderStatuses.InProgress,
        ),
      )
      .then(result => {
        if (!result.order)
          throw createError(errors.OrderNotFound, orderId.orderId);
        if (!result.done)
          throw createError(
            errors.WrongStatus,
            OrderStatuses.InProgress,
            OrderStatuses.New,
            result.oldStatus,
          );
        const orderStartTime = new Date();
        return this.ordersRepository
          .setOrderStartTime(orderId.orderId, orderStartTime)
          .then(() => ({ orderStartTime }));
      })
      .catch(error => error);
  }

  @Post('finish')
  async finishOrder(@Body() body) {
    const orderId = new OrderId(parseInt(body.orderId));
    return await validatorAPI(orderId)
      .then(() =>
        this.ordersRepository.checkAndChangeOrderStatus(
          orderId.orderId,
          OrderStatuses.InProgress,
          OrderStatuses.Finished,
        ),
      )
      .then(result => {
        if (!result.order)
          throw createError(errors.OrderNotFound, orderId.orderId);
        if (!result.done)
          throw createError(
            errors.WrongStatus,
            OrderStatuses.Finished,
            OrderStatuses.InProgress,
            result.oldStatus,
          );
        const orderFinishTime = new Date();

        return this.ordersRepository
          .freeDriver(result.driverId)
          .then(() => this.ordersRepository.freeClient(result.clientId))
          .then(() =>
            this.ordersRepository.setOrderDuration(
              orderId.orderId,
              orderFinishTime,
            ),
          )
          .then(duration => {
            const cost = duration * ONE_SECOND_PRICE;
            return this.ordersRepository
              .setOrderCost(orderId.orderId, cost)
              .then(() => ({
                cost,
                orderFinishTime,
              }));
          });
      })
      .catch(error => error);
  }
}
