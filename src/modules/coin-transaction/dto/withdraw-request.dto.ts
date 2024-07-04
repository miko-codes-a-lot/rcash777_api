import Joi from 'joi';

export const WithdrawRequestSchema = Joi.object({
  amount: Joi.number().min(100).max(1000).required(),
});

export class WithdrawRequestDTO {
  amount: number;
}
