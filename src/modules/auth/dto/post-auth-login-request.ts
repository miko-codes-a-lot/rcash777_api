import * as Joi from 'joi';

export const PostAuthLoginRequest = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
