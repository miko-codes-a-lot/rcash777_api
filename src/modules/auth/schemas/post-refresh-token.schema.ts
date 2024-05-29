import * as Joi from 'joi';

export const PostRefreshTokenRequestSchema = Joi.object({
  refresh_token: Joi.string().required(),
});

export interface PostRefreshTokenRequest {
  refresh_token: string;
}

export interface PostRefreshTokenResponse {
  access_token: string;
}
