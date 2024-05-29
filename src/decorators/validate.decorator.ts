import * as Joi from 'joi';

import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { UsePipes, applyDecorators } from '@nestjs/common';

import { ValidateRequest } from 'src/pipes/validate-request';

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

const joiToObject = (schema: Joi.ObjectSchema<any>) => {
  const description = schema.describe();
  const mappedSchema = {};

  for (const [key, value] of Object.entries(description.keys)) {
    const { type, flags } = value as {
      type: string;
      flags?: {
        presence?: string;
      };
    };

    mappedSchema[key] = {
      name: key,
      type,
      required: flags?.presence === 'required',
    };
  }

  return mappedSchema;
};
