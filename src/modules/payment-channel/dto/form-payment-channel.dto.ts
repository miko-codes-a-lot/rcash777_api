import * as Joi from 'joi';

export const PaymentChannelSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).required(),
});

export class FormPaymentChannelDTO {
  name: string;
  description: string;
}
