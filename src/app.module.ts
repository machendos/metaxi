import { Module } from '@nestjs/common';
import { OrdersModule } from './modules/orders/orders.module';
import { StatisticsModule } from './modules/statistics/statistics.module';

@Module({
  imports: [OrdersModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
