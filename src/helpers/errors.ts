import * as util from 'util';
import { MetaxiError } from './../modules/orders/dto';

export enum errors {
  InvalidAPIData,
  DepartureNotFound,
  DestinationNotFound,
  ClientNotFound,
  ClientAlreadyMadeOrder,
  NoFreeDrivers,
  OrderNotFound,
  WrongStatus,
  DriverNotFound,
}

const errorsDetails = {
  [errors.InvalidAPIData]: {
    reason: 'an invalid object was passed',
    code: 0,
    description: 'Passed data has the next problems: %O',
  },
  [errors.DepartureNotFound]: {
    reason: 'departure point not found',
    code: 1,
    description: 'Departure point %s not found in DB. Please add it before use',
  },
  [errors.DestinationNotFound]: {
    reason: 'destination point not found',
    code: 2,
    description:
      'Destination point %s not found in DB. Please add it before use',
  },
  [errors.ClientNotFound]: {
    reason: 'client not found',
    code: 3,
    description: 'Client %s not found in DB. Please add it before use',
  },
  [errors.ClientAlreadyMadeOrder]: {
    reason: 'client already have active order',
    code: 4,
    description: `Client %s already have an active order.
      A client cannot have several active orders at the same time.
      Complete or cancel an existing order to place a new one`,
  },
  [errors.NoFreeDrivers]: {
    reason: 'there are no free drivers now',
    code: 5,
    description: 'There are no free drivers now. Please, wait',
  },
  [errors.OrderNotFound]: {
    reason: 'order not found',
    code: 6,
    description: 'Order with ID=%s not found in DB. Plese create it before',
  },
  [errors.WrongStatus]: {
    reason: 'the order has an invalid status for this operation',
    code: 7,
    description: `For set the order status to %s, it must have a status %s, but
    now orders status is %s. So you cant do this operation with this order now`,
  },
  [errors.DriverNotFound]: {
    reason: 'driver not found',
    code: 8,
    description: 'Driver %s not found in DB. Please add it before use',
  },
};

export const createError = (errorName, ...args) => {
  const errorDetails = errorsDetails[errorName];

  return new MetaxiError(
    errorDetails.reason,
    errorDetails.code,
    util.format(errorDetails.description, ...args),
  );
};
