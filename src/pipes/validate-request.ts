import * as Joi from 'joi';

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateRequest implements PipeTransform {
  constructor(private readonly schema: Joi.ObjectSchema) {}

  transform(value: any) {
    const { error } = this.schema.validate(value, { abortEarly: false });

    if (error) {
      throw new BadRequestException({
        error: 'Invalid request',
        message: error.message.replace(/(\"|\[|\d\])/g, ''),
      });
    }

    return value;
  }
}
