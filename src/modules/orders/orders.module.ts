import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersRepository } from './../../db/repositories/order.repository';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersRepository],
})
export class OrdersModule {}
