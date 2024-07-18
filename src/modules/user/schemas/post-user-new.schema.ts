import * as Joi from 'joi';

export const PostUserNewRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  isOwner: Joi.boolean().allow(null).default(false),
  isAdmin: Joi.boolean().allow(null).default(false),
  isCityManager: Joi.boolean().allow(null).default(false),
  isMasterAgent: Joi.boolean().allow(null).default(false),
  isAgent: Joi.boolean().allow(null).default(false),
  isPlayer: Joi.boolean().allow(null).default(false),
  tawkto: Joi.object({
    propertyId: Joi.string().optional().allow(null),
    widgetId: Joi.string().optional().allow(null),
  }).optional(),
});

export interface PostUserNewRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  isOwner: boolean;
  isAdmin: boolean;
  isCityManager: boolean;
  isMasterAgent: boolean;
  isAgent: boolean;
  isPlayer: boolean;
  tawkto?: {
    propertyId: string;
    widgetId: string;
  };
}

export interface PostUserNewResponse {
  token: string;
}
