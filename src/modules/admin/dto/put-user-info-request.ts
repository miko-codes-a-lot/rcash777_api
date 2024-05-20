import * as Joi from 'joi';

export const PutUserInfoRequest = Joi.object({
  user_id: Joi.number().required(),
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
});
