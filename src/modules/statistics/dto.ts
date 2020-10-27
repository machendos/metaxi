import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class DriverId {
  @IsInt()
  @Min(0)
  driverId: number;
  constructor(driverId: string) {
    this.driverId = parseInt(driverId);
  }
}

abstract class PostgresInterval {
  @ApiProperty()
  milliseconds: number;
  @ApiProperty()
  seconds: number;
  @ApiProperty()
  minutes: number;
  @ApiProperty()
  hours: number;
}

export class StatisticsCount {
  @ApiProperty()
  driverId: number;

  @ApiProperty()
  ordersCount: number;

  constructor(driverId: string, ordersCount: number) {
    this.driverId = parseInt(driverId);
    this.ordersCount = ordersCount;
  }
}

export class StatisticsCost {
  @ApiProperty()
  driverId: number;

  @ApiProperty()
  totalCost: number;

  constructor(driverId: string, totalCost: string) {
    this.driverId = parseInt(driverId);
    this.totalCost = parseFloat(totalCost);
  }
}

export class StatisticsTime {
  @ApiProperty()
  driverId: number;

  @ApiProperty()
  averageRoadTime: PostgresInterval;

  constructor(driverId: string, averageRoadTime: number) {
    this.driverId = parseInt(driverId);
    this.averageRoadTime = (averageRoadTime as unknown) as PostgresInterval;
  }
}

export class StatisticsFrequentDestination {
  @ApiProperty()
  driverId: number;

  @ApiProperty()
  toPointId: number;

  @ApiProperty()
  count: number;

  @ApiProperty()
  pointTitle: string;

  constructor(
    driverId: string,
    toPointId: number,
    count: string,
    pointTitle: string,
  ) {
    this.driverId = parseInt(driverId);
    this.toPointId = toPointId;
    this.count = parseInt(count);
    this.pointTitle = pointTitle;
  }
}
