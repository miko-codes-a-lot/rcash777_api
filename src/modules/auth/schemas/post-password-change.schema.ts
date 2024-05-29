import * as Joi from 'joi';

export const PostPasswordChangeRequestSchema = Joi.object({
  old_password: Joi.string().required(),
  new_password: Joi.string().min(6).required(),
});

export interface PostPasswordChangeRequest {
  old_password: string;
  new_password: string;
}
