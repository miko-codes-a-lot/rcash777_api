import * as Joi from 'joi';

export const RoleSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
  permissionIds: Joi.array().items(Joi.string()).required(),
});

export class FormRoleDTO {
  name: string;
  module: string;
  description: string;
  permissionIds: string[];
}
