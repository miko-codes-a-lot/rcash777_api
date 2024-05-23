import * as Joi from 'joi';

import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { UsePipes, applyDecorators } from '@nestjs/common';

import { ValidateRequest } from 'src/pipes/validate-request';
import { joiToSwagger } from 'src/utils/joi-to-swagger';

type ValidateTypes = {
  [key in 'body' | 'query']?: Joi.ObjectSchema;
};

export const Validate = ({ body, query }: ValidateTypes) =>
  applyDecorators(
    ...(body
      ? [ApiBody({ schema: joiToSwagger(body) }), UsePipes(new ValidateRequest(body, 'body'))]
      : []),
    ...(query
      ? [ApiQuery({ schema: joiToSwagger(query) }), UsePipes(new ValidateRequest(query, 'query'))]
      : []),
  );
