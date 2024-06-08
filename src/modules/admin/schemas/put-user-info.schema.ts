import * as Joi from 'joi';

export const PutUserInfoRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
});

export interface PutUserInfoRequest {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
}
