import * as Joi from 'joi';

import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { UsePipes, applyDecorators } from '@nestjs/common';

import { ValidateRequest } from 'src/pipes/validate-request';
import { joiToObject } from 'src/utils/joi-to-object';

type ValidateTypes = {
  [key in 'body' | 'query']?: Joi.ObjectSchema;
};

export const Validate = ({ body, query }: ValidateTypes) =>
  applyDecorators(
    ...(body
      ? [
          ApiBody({
            schema: {
              type: 'object',
              properties: joiToObject(body),
            },
          }),
          UsePipes(new ValidateRequest(body, 'body')),
        ]
      : []),
    ...(query
      ? [
          ...Object.values(joiToObject(query)).map((val) => ApiQuery(val)),
          UsePipes(new ValidateRequest(query, 'query')),
        ]
      : []),
  );
