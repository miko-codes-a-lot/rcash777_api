import * as Joi from 'joi';

export const PostUserNewRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  roleIds: Joi.array(),
  // tawkto: Joi.object({
  //   propertyId: Joi.string().optional().allow(null),
  //   widgetId: Joi.string().optional().allow(null),
  // }),
});

export interface PostUserNewRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  roleIds: string[];
  // tawkto: {
  //   propertyId: string;
  //   widgetId: string;
  // };
}

export interface PostUserNewResponse {
  token: string;
}
