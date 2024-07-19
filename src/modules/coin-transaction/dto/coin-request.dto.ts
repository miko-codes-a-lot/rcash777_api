import Joi from 'joi';

export const WithdrawRequestSchema = Joi.object({
  amount: Joi.number().min(200).required(),
  paymentChannelId: Joi.string().guid().required(),
});

export const DepositRequestSchema = Joi.object({
  amount: Joi.number().min(50).required(),
  paymentChannelId: Joi.string().guid().required(),
});

export class CoinRequestDTO {
  amount: number;
  paymentChannelId: string;
}
