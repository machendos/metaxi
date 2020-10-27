import { StatisticsRepository } from 'src/db/repositories/statistics.repository';
import { createError, errors } from 'src/helpers/errors';

@Controller('statistics')
export class StatisticsController {
  @Get()
  getOrders(): string {
    return 'Orders';
  }
}
