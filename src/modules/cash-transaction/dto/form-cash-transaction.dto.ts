import * as Joi from 'joi';
import { TransactionType, TransactionTypeCategory } from 'src/enums/transaction.enum';
import { PaymentChannel } from 'src/modules/payment-channel/entities/payment-channel.entity';
import { User } from 'src/modules/user/entities/user.entity';

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
  userId: string;
  paymentChannelId: string;

  getUser(): User {
    const user = new User();
    user.id = this.userId;
    return user;
  }

  getPaymentChannel(): PaymentChannel {
    const channel = new PaymentChannel();
    channel.id = this.paymentChannelId;
    return channel;
  }
}
