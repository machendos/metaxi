import * as util from 'util';
import { MetaxiError } from './dto';

export enum errors {
  InvalidAPIData,
  DepartureNotFound,
  DestinationNotFound,
  ClientNotFound,
  ClientAlreadyMadeOrder,
  NoFreeDrivers,
}

const errorsDetails = {
  [errors.InvalidAPIData]: {
    reason: 'An invalid object was passed',
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
    reason: 'Client already have active order',
    code: 4,
    description: `Client %s already have an active order.
      A client cannot have several active orders at the same time.
      Complete or cancel an existing order to place a new one`,
  },
  [errors.NoFreeDrivers]: {
    reason: 'There are no free drivers now',
    code: 5,
    description: 'There are no free drivers now. Please, wait',
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
