import * as Joi from 'joi';

export const PutUserUpdateRequestSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
});

export interface PostUserUpdateRequest {
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}
