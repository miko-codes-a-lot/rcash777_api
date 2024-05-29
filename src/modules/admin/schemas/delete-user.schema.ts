import * as Joi from 'joi';

export const DeleteUserRequestSchema = Joi.object({
  user_id: Joi.string().required(),
});

export interface DeleteUserRequest {
  user_id: string;
}
