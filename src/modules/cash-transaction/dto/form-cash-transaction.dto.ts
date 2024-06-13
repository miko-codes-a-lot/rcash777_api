import * as Joi from 'joi';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';

export const CashTransactionSchema = Joi.object({
  note: Joi.string().default(''),
  // type: Joi.string().valid(...Object.values(TransactionType)),
  // typeCategory: Joi.string().valid(...Object.values(TransactionTypeCategory)),
  amount: Joi.number().min(0).required(),
  paymentChannelId: Joi.string().guid().required(),
});

export class FormCashTransactionDTO {
  note: string;
  type: TransactionType;
  typeCategory: TransactionTypeCategory;
  amount: number;
  playerId: string;
  paymentChannelId: string;
}
