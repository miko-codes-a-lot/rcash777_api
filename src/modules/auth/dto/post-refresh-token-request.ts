import * as Joi from 'joi';

export const PostRefreshTokenRequest = Joi.object({
  refresh_token: Joi.string().required(),
});
