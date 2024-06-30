import Joi from 'joi';
import { Platform } from 'src/enums/platform.enum';

export const FormLaunchGameSchema = Joi.object({
  identity: Joi.object({
    ipAddress: Joi.string().required(),
    userAgent: Joi.string().required(),
    originDomain: Joi.string().required(),
  }).required(),
  token: Joi.string().required(),
  launchCode: Joi.string().required(),
  clientCode: Joi.string().required(),
  playerPlatform: Joi.string()
    .valid(...Object.values(Platform))
    .required(),
  urls: Joi.object({
    exitUrl: Joi.string().required(),
    depositUrl: Joi.string().required(),
  }),
  currency: Joi.string().valid('PHP').required(),
});

export interface FormLaunchGameDTO {
  identity: {
    ipAddress: string;
    userAgent: string;
    originDomain: string;
  };
  token: string;
  launchCode: string;
  clientCode: string;
  playerPlatform: Platform;
  urls: {
    exitUrl: string;
    depositUrl: string;
  };
  currency: string;
}
