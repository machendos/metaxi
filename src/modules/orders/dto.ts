import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';
import {
  ClientStatuses,
  DriverStatuses,
  OrderStatuses,
} from '../../helpers/enums';

export class NewOrder {
  @IsInt()
  @Min(0)
  @ApiProperty()
  clientId: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
  fromId: number;

  @IsInt()
  @Min(0)
  @ApiProperty()
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
  @ApiProperty()
  orderId: number;
  constructor(orderId: number) {
    this.orderId = orderId;
  }
}

export class CreatedOrder {
  @ApiProperty()
  public orderId: number;
  @ApiProperty()
  public driverId: number;
  constructor(orderId: number, driverId: number) {
    this.orderId = orderId;
    this.driverId = driverId;
  }
}

export class MetaxiError {
  @ApiProperty()
  public reason: string;
  @ApiProperty()
  public code: number;
  @ApiProperty()
  public description: string;

  public error: boolean;
  constructor(reason: string, code: number, description: string) {
    this.error = true;
    this.reason = reason;
    this.code = code;
    this.description = description;
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

export class StartedOrder {
  @ApiProperty()
  public orderStartTime: Date;
  constructor(orderStartTime: Date) {
    this.orderStartTime = orderStartTime;
  }
}

export class FinishedOrder {
  @ApiProperty()
  public orderFinishTime: Date;
  @ApiProperty()
  public cost: number;
  constructor(orderFinishTime: Date, cost: number) {
    this.orderFinishTime = orderFinishTime;
    this.cost = cost;
  }
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
