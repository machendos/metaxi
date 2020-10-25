import knex from '.././knex';
import { DriverStatuses } from './../enums';
import { Driver } from './../../modules/orders/dto';

export class OrdersRepository {
  takeFreeDriver(): Promise<Driver> {
    return knex.transaction(trx =>
      trx
        .from<Driver>('driver')
        .select('driverId', 'driverName', 'status')
        .where({ status: DriverStatuses.Free })
        .limit(1)
        .then(drivers => {
          if (drivers.length) {
            const driver = drivers[0];
            return trx('driver')
              .where({ driverId: driver.driverId })
              .update({ status: DriverStatuses.TookOrder })
              .then(() => driver);
          }
        }),
    );
  }
}
