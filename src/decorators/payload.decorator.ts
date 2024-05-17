import * as Joi from 'joi';

import { UsePipes, applyDecorators } from '@nestjs/common';

import { ApiBody } from '@nestjs/swagger';
import { ValidateRequest } from 'src/pipes/validate-request';
import { joiToSwagger } from 'src/utils/joi-to-swagger';

export const Payload = (schema: Joi.ObjectSchema) =>
  applyDecorators(
    ApiBody({ schema: joiToSwagger(schema) }) as PropertyDecorator,
    UsePipes(new ValidateRequest(schema)) as PropertyDecorator,
  );
