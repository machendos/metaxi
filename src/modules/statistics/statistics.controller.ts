import { Controller, Get } from '@nestjs/common';

@Controller('statistics')
export class StatisticsController {
  @Get()
  getOrders(): string {
    return 'Orders';
  }
}
