import { Controller, Post, Body, Res, HttpException } from '@nestjs/common';
import {
  CreatedOrder,
  FinishedOrder,
  MetaxiError,
  NewOrder,
  OrderId,
  StartedOrder,
} from './dto';
import { errors, createError } from './../../helpers/errors';
import { OrdersRepository } from '../../db/repositories/order.repository';
import { ClientStatuses, OrderStatuses } from '../../../src/helpers/enums';
import validatorAPI from '../../helpers/validator';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

const ONE_SECOND_PRICE = 0.01;

@ApiTags('orders-manipulation')
@Controller('order')
export class OrdersController {
  constructor(private ordersRepository: OrdersRepository) {}
  @Post()
  @ApiBody({ type: NewOrder })
  @ApiResponse({
    status: 200,
    type: CreatedOrder,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  async createOrder(@Body() body, @Res() res: Response) {
    const order = new NewOrder(body.clientId, body.fromId, body.toId);
    await validatorAPI(order)
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
              .then(orderId =>
                res.json(new CreatedOrder(orderId, driver.driverId)),
              ),
          );
      })
      .catch(error => res.status(400).json(error));
  }

  @Post('start')
  @ApiBody({ type: OrderId })
  @ApiResponse({
    status: 200,
    type: StartedOrder,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  async startOrder(@Body() body, @Res() res: Response) {
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
          .then(() => res.json(new StartedOrder(orderStartTime)));
      })
      .catch(error => res.status(400).json(error));
  }

  @Post('finish')
  @ApiBody({ type: OrderId })
  @ApiResponse({
    status: 200,
    type: FinishedOrder,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  async finishOrder(@Body() body, @Res() res: Response) {
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
              .then(() => res.json(new FinishedOrder(orderFinishTime, cost)));
          });
      })
      .catch(error => res.status(400).json(error));
  }
}
