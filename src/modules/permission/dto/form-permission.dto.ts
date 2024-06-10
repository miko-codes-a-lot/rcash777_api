import * as Joi from 'joi';

export const PermissionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  code: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
});

export class FormPermissionDTO {
  name: string;
  code: string;
  description: string;
}
