import * as Joi from 'joi';

export const PostAuthLoginRequestSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export interface PostAuthLoginRequest {
  email: string;
  password: string;
}

export interface PostAuthLoginResponse {
  access_token: string;
  refresh_token: string;
}
