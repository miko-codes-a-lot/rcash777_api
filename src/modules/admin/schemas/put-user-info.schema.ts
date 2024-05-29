import * as Joi from 'joi';

export const PutUserInfoRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
});

export interface PutUserInfoRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}
