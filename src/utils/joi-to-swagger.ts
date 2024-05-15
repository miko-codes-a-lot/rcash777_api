import * as Joi from 'joi';

import j2s, { SwaggerSchema } from 'joi-to-swagger';

export const joiToSwagger = (schema: Joi.ObjectSchema<any>): SwaggerSchema => {
  const { swagger: PostUserRequestSwagger } = j2s(schema);
  return PostUserRequestSwagger;
};
