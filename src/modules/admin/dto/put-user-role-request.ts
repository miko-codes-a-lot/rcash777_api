import * as Joi from 'joi';

import { ERoles } from 'src/enums/roles.enum';

export const PutUserRoleRequest = Joi.object({
  new_role: Joi.number().valid(ERoles.ADMIN, ERoles.USER).required(),
});
