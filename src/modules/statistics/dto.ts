import { IsInt, Min } from 'class-validator';

export class DriverId {
  @IsInt()
  @Min(0)
  driverId: number;
  constructor(driverId: string) {
    console.log(parseInt(driverId) + 3);
    this.driverId = parseInt(driverId);
    console.log(this);
  }
}
