import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { OrdersRepository } from './db/repositories/order.repository';

@Module({
  imports: [OrdersModule, StatisticsModule],
  controllers: [],
  providers: [OrdersRepository],
})
export class AppModule {}
