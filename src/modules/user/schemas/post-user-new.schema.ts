import * as Joi from 'joi';

export const PostUserNewRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().required(),
  address: Joi.string().required(),
});

export interface PostUserNewRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}

export interface PostUserNewResponse {
  token: string;
}
