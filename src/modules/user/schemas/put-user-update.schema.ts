import * as Joi from 'joi';

export const PutUserUpdateRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
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
  tawkto?: {
    propertyId: string;
    widgetId: string;
  };
}
