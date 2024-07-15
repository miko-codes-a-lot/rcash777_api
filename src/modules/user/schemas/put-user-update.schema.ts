import * as Joi from 'joi';

export const PutUserUpdateRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  roleIds: Joi.array(),
  tawkto: Joi.object({
    propertyId: Joi.string().optional().allow(null),
    widgetId: Joi.string().optional().allow(null),
  }).optional(),
});

export interface PostUserUpdateRequest {
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  roleIds: string[];
  tawkto?: {
    propertyId: string;
    widgetId: string;
  };
}
