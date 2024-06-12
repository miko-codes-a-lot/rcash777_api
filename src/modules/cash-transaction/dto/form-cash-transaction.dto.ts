import * as Joi from 'joi';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';

export const CashTransactionSchema = Joi.object({
  name: Joi.string().min(3).required(),
  note: Joi.string().default(''),
  type: Joi.string().valid(...Object.values(TransactionType)),
  typeCategory: Joi.string().valid(...Object.values(TransactionTypeCategory)),
  amount: Joi.number().min(0).required(),
  paymentChannelId: Joi.string().guid().required(),
});

export class FormCashTransactionDTO {
  name: string;
  note: string;
  type: TransactionType;
  typeCategory: TransactionTypeCategory;
  amount: number;
  paymentChannelId: string;
}
