import { IsInt, Min } from 'class-validator';
import { ClientStatuses, DriverStatuses } from '../../helpers/enums';

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
    public reason: string,
    public code: number,
    public description: string,
  ) {
    this.error = true;
  }
}

export class Driver {
  constructor(
    public driverId: number,
    public driverName: string,
    public status: DriverStatuses,
  ) {}
}

export class Client {
  constructor(
    public clientId: number,
    public clientName: string,
    public status: ClientStatuses,
  ) {}
}
