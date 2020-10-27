import knex from '.././knex';
import { Injectable } from '@nestjs/common';
import { OrderStatuses } from '../../../src/helpers/enums';

@Injectable()
export class StatisticsRepository {
  ordersCount(driverId: string) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .count()
      .then(data => parseInt(data[0].count.toString()));
  }
  averageRoadTime(driverId: string) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .avg('duration')
      .then(data => data[0].avg);
  }
  sumCost(driverId: string) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .sum('cost')
      .then(data => data[0].sum);
  }
  mostFrequentDest(driverId: string) {
    return knex.transaction(async trx => {
      const { toPointId, count } = await trx('order')
        .select('toPointId', knex.raw('count("toPointId")'))
        .where({ driverId, status: OrderStatuses.Finished })
        .groupBy('toPointId')
        .orderByRaw('count("toPointId")')
        .limit(1)
        .then(data => data[0]);
      return trx('point')
        .select('pointTitle')
        .where({ pointId: toPointId })
        .then(points => ({
          count,
          toPointId,
          pointTitle: points[0].pointTitle,
        }));
    });
  }
  checkDriver(driverId: string): Promise<boolean> {
    return knex
      .from('driver')
      .select('driverId')
      .where({ driverId })
      .then(drivers => !!drivers.length);
  }
}
