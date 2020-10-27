import { IsInt, Min } from 'class-validator';
import {
  ClientStatuses,
  DriverStatuses,
  OrderStatuses,
} from '../../helpers/enums';

export class NewOrder {
  @IsInt()
  @Min(0)
  clientId: number;

  @IsInt()
  @Min(0)
  fromId: number;

  @IsInt()
  @Min(0)
  toId: number;
  constructor(clientId: string, fromId: string, toId: string) {
    this.clientId = parseInt(clientId);
    this.fromId = parseInt(fromId);
    this.toId = parseInt(toId);
  }
}

export class OrderId {
  @IsInt()
  @Min(0)
  orderId: number;
  constructor(orderId: number) {
    this.orderId = orderId;
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

export class ChangeOrderStatusResult {
  constructor(
    public order: boolean,
    public done?: boolean,
    public oldStatus?: OrderStatuses,
    public driverId?: number,
    public clientId?: number,
    public orderId?: number,
  ) {}
}
