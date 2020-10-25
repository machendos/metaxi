import { DriverStatuses } from './../../db/enums';

export class Order {
  constructor(
    public clientId: number,
    public fromId: number,
    public toId: number,
  ) {}
}

export class Driver {
  constructor(
    public driverId: number,
    public driverName: number,
    public status: DriverStatuses,
  ) {}
}
