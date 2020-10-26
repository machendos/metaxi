export enum DriverStatuses {
  Free = 'free',
  TookOrder = 'tookOrder',
  FulfillsOrder = 'fulfillsOrder',
}

export enum ClientStatuses {
  Free = 'free',
  WaitForDriver = 'waitForDriver',
  InTheCar = 'inTheCar',
}

export enum OrderStatuses {
  New = 'new',
  InProgress = 'inProgress',
  Canceled = 'canceled',
  Finished = 'finished',
}
