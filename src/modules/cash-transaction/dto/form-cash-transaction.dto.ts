import * as Joi from 'joi';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';

export const CashTransactionSchema = Joi.object({
  note: Joi.string().default(''),
  // type: Joi.string().valid(...Object.values(TransactionType)),
  // typeCategory: Joi.string().valid(...Object.values(TransactionTypeCategory)),
  amount: Joi.number().min(0).required(),
  userId: Joi.string().guid().required(),
  paymentChannelId: Joi.string().guid().required(),
});

export class FormCashTransactionDTO {
  note: string;
  type: TransactionType;
  typeCategory: TransactionTypeCategory;
  amount: number;
  userId: string;
  paymentChannelId: string;
}
