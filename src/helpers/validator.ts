import { errors, createError } from './errors';
import { validate } from 'class-validator';

export default object => {
  console.log(object);
  return validate(object).then(validationErrors => {
    if (validationErrors.length) {
      throw createError(
        errors.InvalidAPIData,
        validationErrors.map(error => Object.values(error.constraints)).flat(),
      );
    }
  });
};
