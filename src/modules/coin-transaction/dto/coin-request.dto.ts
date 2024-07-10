import Joi from 'joi';

export const WithdrawRequestSchema = Joi.object({
  amount: Joi.number().min(200).max(50000).required(),
});

export const DepositRequestSchema = Joi.object({
  amount: Joi.number().min(50).max(50000).required(),
});

export class CoinRequestDTO {
  amount: number;
}
