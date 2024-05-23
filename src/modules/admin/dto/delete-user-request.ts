import * as Joi from 'joi';

export const DeleteUserRequest = Joi.object({
  user_id: Joi.string().required(),
});
