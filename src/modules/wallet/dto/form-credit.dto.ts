import * as Joi from 'joi';
import { Platform } from 'src/enums/platform.enum';
import { TransactionTypeCategory } from 'src/enums/transaction.enum';

export const FormCreditSchema = Joi.object({
  player: Joi.string().guid().required(),
  clientToken: Joi.string().allow('').optional(),
  roundId: Joi.string().required(),
  game: Joi.string().required(),
  platform: Joi.string()
    .valid(...Object.values(Platform))
    .optional(),
  transId: Joi.string().required(),
  currency: Joi.string().required(),
  amount: Joi.number().required(),
  jackpotAmount: Joi.number().allow(null).optional(),
  roundEnded: Joi.bool().allow(null).optional(),
  reason: Joi.string().required(),
});

export interface FormCreditDTO {
  player: string;
  clientToken: string;
  roundId: string;
  game: string;
  platform: Platform;
  transId: string;
  currency: string;
  amount: number;
  jackpotAmount?: number;
  roundEnded: boolean;
  reason?: TransactionTypeCategory;
}
