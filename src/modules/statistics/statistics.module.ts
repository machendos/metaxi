import { Module } from '@nestjs/common';
import { StatisticsRepository } from 'src/db/repositories/statistics.repository';
import { StatisticsController } from './statistics.controller';

@Module({
  imports: [],
  controllers: [StatisticsController],
  providers: [StatisticsRepository],
})
export class StatisticsModule {}
