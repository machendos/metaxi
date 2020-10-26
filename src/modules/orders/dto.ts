import { DriverStatuses } from './../../db/enums';

export class Order {
  @IsInt()
  @Min(0)
  clientId: number;

  @IsInt()
  @Min(0)
  fromId: number;

  @IsInt()
  @Min(0)
  toId: number;
  constructor(clientId: number, fromId: number, toId: number) {
    this.clientId = clientId;
    this.fromId = fromId;
    this.toId = toId;
  }
}

export class CreatedOrder {
  constructor(public orderId: number, public driverId: number) {}
}

export class MetaxiError {
  public error: boolean;
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
