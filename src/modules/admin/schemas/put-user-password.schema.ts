import * as Joi from 'joi';

export const PutUserPasswordSchema = Joi.object({
  new_password: Joi.string().min(6).required(),
});

export interface PutUserPassword {
  new_password: string;
}
