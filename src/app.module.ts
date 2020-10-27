import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { OrdersRepository } from './db/repositories/order.repository';
import { StatisticsRepository } from './db/repositories/statistics.repository';

@Module({
  imports: [OrdersModule, StatisticsModule],
  controllers: [],
  providers: [OrdersRepository, StatisticsRepository],
})
export class AppModule {}
