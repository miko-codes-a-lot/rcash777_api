import * as Joi from 'joi';

import { ERoles } from 'src/enums/roles.enum';

export const PostUserRoleRequest = Joi.object({
  user_id: Joi.number().required(),
  new_role: Joi.number().valid(ERoles.ADMIN, ERoles.USER).required(),
});
