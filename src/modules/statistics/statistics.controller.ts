import { Controller, Get, Param, Res } from '@nestjs/common';
import { StatisticsRepository } from '../../../src/db/repositories/statistics.repository';
import { createError, errors } from '../../../src/helpers/errors';
import validatorAPI from '../../helpers/validator';
import {
  DriverId,
  StatisticsCost,
  StatisticsFrequentDestination,
  StatisticsTime,
} from './dto';
import { MetaxiError } from '../orders/dto';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { StatisticsCount } from './dto';
import { Response } from 'express';

@ApiTags('statistics')
@Controller('statistics')
export class StatisticsController {
  constructor(private statisticsRepsitory: StatisticsRepository) {}
  @ApiResponse({
    status: 200,
    type: StatisticsCount,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  @Get('count/:id')
  ordersCount(@Param('id') driverId: string, @Res() res: Response) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.ordersCount(driverId))
          .then(count => res.json(new StatisticsCount(driverId, count))),
      )
      .catch(error => res.status(400).json(error));
  }
  @ApiResponse({
    status: 200,
    type: StatisticsTime,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  @Get('averageTime/:id')
  averageRoadTime(@Param('id') driverId: string, @Res() res: Response) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.averageRoadTime(driverId))
          .then(time => res.json(new StatisticsTime(driverId, time))),
      )
      .catch(error => res.status(400).json(error));
  }
  @ApiResponse({
    status: 200,
    type: StatisticsFrequentDestination,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  @Get('frequentDestination/:id')
  mostFrequentDestination(@Param('id') driverId: string, @Res() res: Response) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.mostFrequentDest(driverId))
          .then(({ count, toPointId, pointTitle }) =>
            res.json(
              new StatisticsFrequentDestination(
                driverId,
                toPointId,
                count,
                pointTitle,
              ),
            ),
          ),
      )
      .catch(error => res.status(400).json(error));
  }
  @ApiResponse({
    status: 200,
    type: StatisticsCost,
  })
  @ApiResponse({
    status: 400,
    type: MetaxiError,
  })
  @Get('cost/:id')
  sumCost(@Param('id') driverId: string, @Res() res: Response) {
    return validatorAPI(new DriverId(driverId))
      .then(() =>
        this.statisticsRepsitory
          .checkDriver(driverId)
          .then(driverFounded => {
            if (!driverFounded)
              throw createError(errors.DriverNotFound, driverId);
          })
          .then(() => this.statisticsRepsitory.sumCost(driverId))
          .then(cost => res.json(new StatisticsCost(driverId, cost))),
      )
      .catch(error => res.status(400).json(error));
  }
}
