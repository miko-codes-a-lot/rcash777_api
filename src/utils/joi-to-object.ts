import Joi from 'joi';

export const joiToObject = (schema: Joi.ObjectSchema<any>) => {
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
