import Joi from 'joi';

export const WithdrawRequestSchema = Joi.object({
  amount: Joi.number().min(100).max(50000).required(),
});

export class WithdrawRequestDTO {
  amount: number;
}
