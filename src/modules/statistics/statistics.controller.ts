import { Controller, Get } from '@nestjs/common';

@Controller()
export class StatisticsController {
  @Get()
  getOrders(): string {
    return 'Orders';
  }
}
