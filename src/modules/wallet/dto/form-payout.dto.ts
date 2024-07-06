import Joi from 'joi';
import { Platform } from 'src/enums/platform.enum';
import { TransactionTypeCategory } from 'src/enums/transaction.enum';

export const FormPayoutSchema = Joi.object({
  player: Joi.string().required(),
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

export interface FormPayoutDTO {
  player: string;
  game: string;
  platform: Platform;
  roundId: string;
  transId: string;
  currency: string;
  amount: number;
  jackpotAmount?: number;
  reason: TransactionTypeCategory;
  roundEnded: false;
}
