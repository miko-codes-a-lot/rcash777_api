import * as Joi from 'joi';

export const PutUserUpdateRequest = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
});
