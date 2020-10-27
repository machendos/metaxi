import { errors, createError } from './errors';
import { validate } from 'class-validator';

export default object => {
  return validate(object).then(validationErrors => {
    if (validationErrors.length) {
      throw createError(
        errors.InvalidAPIData,
        validationErrors.map(error => Object.values(error.constraints)).flat(),
      );
    }
  });
};
