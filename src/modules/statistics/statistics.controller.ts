import { Controller, Get, Param } from '@nestjs/common';
import { StatisticsRepository } from '../../../src/db/repositories/statistics.repository';
import { createError, errors } from '../../../src/helpers/errors';
import validatorAPI from '../../helpers/validator';
import { DriverId } from './dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsRepsitory: StatisticsRepository) {}
  @Get('count/:id')
  ordersCount(@Param('id') driverId: string) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.ordersCount(driverId)),
      )
      .catch(error => error);
  }
  @Get('averageTime/:id')
  averageRoadTime(@Param('id') driverId: string) {
    console.log(driverId);
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.averageRoadTime(driverId)),
      )
      .catch(error => error);
  }
  @Get('frequentDestination/:id')
  mostFrequentDestination(@Param('id') driverId: string) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() =>
            this.statisticsRepsitory.mostFrequentDestination(driverId),
          ),
      )
      .catch(error => error);
  }
  @Get('cost/:id')
  sumCost(@Param('id') driverId: string) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.sumCost(driverId)),
      )
      .catch(error => error);
  }
}
