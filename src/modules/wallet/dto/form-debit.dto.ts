import * as Joi from 'joi';

import { Platform } from 'src/enums/platform.enum';
import { TransactionTypeCategory } from 'src/enums/transaction.enum';

export const FormDebitSchema = Joi.object({
  player: Joi.string().guid().required(),
  clientToken: Joi.string().optional(),
  roundId: Joi.string().required(),
  game: Joi.string().required(),
  platform: Joi.string()
    .valid(...Object.values(Platform))
    .optional(),
  transId: Joi.string().required(),
  // handled in service itself because we have to give special error format
  currency: Joi.string().required(), // .valid('PHP')
  amount: Joi.number().required(),
  jpContrib: Joi.number().allow(null).optional(),
  reason: Joi.string()
    .valid(...Object.values(TransactionTypeCategory))
    .required(),
});

export interface FormDebitDTO {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
  transId: string;
  currency: string;
  amount: number;
  jpContrib?: number;
  reason: TransactionTypeCategory;
}
