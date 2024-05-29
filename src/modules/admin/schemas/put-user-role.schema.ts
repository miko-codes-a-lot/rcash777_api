import * as Joi from 'joi';

import { ERoles } from 'src/enums/roles.enum';
import { valueOf } from 'src/types/valueOf.type';

export const PutUserRoleRequestSchema = Joi.object({
  new_role: Joi.number().valid(ERoles.ADMIN, ERoles.USER).required(),
});

export interface PutUserRoleRequest {
  new_role: valueOf<typeof ERoles>;
}
