import * as Joi from 'joi';

import { ArgumentMetadata, BadRequestException, Injectable, Paramtype, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidateRequest<T> implements PipeTransform {
  constructor(
    private readonly schema: Joi.ObjectSchema,
    private readonly type: Paramtype,
  ) {}

  transform(value: T, metadata: ArgumentMetadata) {
    if (metadata.type === this.type) {
      const { error } = this.schema.validate(value, { abortEarly: false });
      if (error) {
        throw new BadRequestException({
          error: 'Invalid request',
          message: error.message.replace(/(\"|\d)/g, ''),
        });
      }
    }

    return value;
  }
}
