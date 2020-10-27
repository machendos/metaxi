import knex from '.././knex';
import { Injectable } from '@nestjs/common';
import { OrderStatuses } from 'src/helpers/enums';

@Injectable()
export class StatisticsRepository {
  ordersCount(driverId: number) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .count()
      .then(data => ({ driverId, ordersCount: data[0].count }));
  }
  averageRoadTime(driverId: number) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .avg('duration')
      .then(data => ({ driverId, averageRoadTime: data[0].avg }));
  }
  sumCost(driverId: number) {
    return knex('order')
      .where({ driverId, status: OrderStatuses.Finished })
      .sum('cost')
      .then(data => ({ driverId, totalCost: data[0].sum }));
  }
  mostFrequentDestination(driverId: number) {
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
          driverId,
          toPointId,
          count,
          pointTitle: points[0].pointTitle,
        }));
    });
  }
  checkDriver(driverId: number): Promise<boolean> {
    return knex
      .from('driver')
      .select('driverId')
      .where({ driverId })
      .then(drivers => !!drivers.length);
  }
}
