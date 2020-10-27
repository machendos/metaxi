import { IsInt, Min } from 'class-validator';

export class DriverId {
  @IsInt()
  @Min(0)
  driverId: number;
  constructor(driverId: number) {
    this.driverId = driverId;
  }
}
