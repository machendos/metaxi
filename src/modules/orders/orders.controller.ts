import { Controller, Post, Body } from '@nestjs/common';
import { CreatedOrder, MetaxiError, Order } from './dto';
import { errors, createError } from './../../helpers/errors';
import { validate } from 'class-validator';
import { OrdersRepository } from '../../db/repositories/order.repository';
import validatorAPI from '../../helpers/validator';

@Controller('order')
export class OrdersController {
  constructor(private ordersRepository: OrdersRepository) {}
  @Post()
  async createOrder(@Body() body): Promise<CreatedOrder | MetaxiError> {
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
                new Date(),
                order.clientId,
              )
              .then(orderId => new CreatedOrder(orderId, driver.driverId)),
          );
      })
      .catch(error => error);
  }
}
