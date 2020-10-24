import { Controller, Post } from '@nestjs/common';

@Controller('order')
export class OrdersController {
  @Post()
  createOrder(): string {
    return 'Order was created';
  }
}
