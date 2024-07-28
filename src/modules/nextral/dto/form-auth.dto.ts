import Joi from 'joi';
import { Platform } from 'src/enums/platform.enum';

export const FormCreditSchema = Joi.object({
  token: Joi.string().required(),
  device: Joi.string().required(),
  game: Joi.string().required(),
  platform: Joi.string()
    .valid(...Object.values(Platform))
    .required(),
});

export interface FormAuthDTO {
  token: string;
  device: string;
  game: string;
  platform: Platform;
}
