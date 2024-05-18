import * as Joi from 'joi';

export const PostPasswordChangeRequest = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
});
