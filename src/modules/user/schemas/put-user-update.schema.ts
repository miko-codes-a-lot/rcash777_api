import * as Joi from 'joi';

export const PutUserUpdateRequestSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  address: Joi.string().required(),
  commission: Joi.number().min(0).max(100).default(0).optional(),
  rebate: Joi.number().min(0).max(100).default(0).optional(),
  isOwner: Joi.boolean().allow(null).default(false),
  isAdmin: Joi.boolean().allow(null).default(false),
  isCityManager: Joi.boolean().allow(null).default(false),
  isMasterAgent: Joi.boolean().allow(null).default(false),
  isAgent: Joi.boolean().allow(null).default(false),
  isPlayer: Joi.boolean().allow(null).default(false),
  isActivated: Joi.boolean().allow(null).default(true),
  tawkto: Joi.object({
    propertyId: Joi.string().allow('').optional(),
    widgetId: Joi.string().allow('').optional(),
  }).optional(),
});

export interface PostUserUpdateRequest {
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  commission: number;
  rebate: number;
  isOwner: boolean;
  isAdmin: boolean;
  isCityManager: boolean;
  isMasterAgent: boolean;
  isAgent: boolean;
  isPlayer: boolean;
  isActivated: boolean;
  tawkto?: {
    propertyId: string;
    widgetId: string;
  };
}
