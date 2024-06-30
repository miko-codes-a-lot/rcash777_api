import 'dotenv/config';

import Joi from 'joi';

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(5001),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    POSTGRES_HOST: Joi.string().required().description('Postgres host'),
    POSTGRES_USERNAME: Joi.string().required().description('Postgres username'),
    POSTGRES_PASSWORD: Joi.string().required().description('Postgres password'),
    POSTGRES_DATABASE: Joi.string().required().description('Postgres database'),
    GAME_API_ZENITH_TOKEN: Joi.string().required().description('Zenith Basic Token'),
    GAME_API_ZENITH_KEY: Joi.string().required().description('Zenith API KEY'),
    GAME_API_ZENITH_URI: Joi.string().required().description('Zenith URI'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  pg: {
    host: envVars.POSTGRES_HOST,
    username: envVars.POSTGRES_USERNAME,
    password: envVars.POSTGRES_PASSWORD,
    database: envVars.POSTGRES_DATABASE,
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
  },
  game_api: {
    zenith: {
      token: envVars.GAME_API_ZENITH_TOKEN,
      uri: envVars.GAME_API_ZENITH_URI,
      apiKey: envVars.GAME_API_ZENITH_KEY,
    }
  },
};

export default config;
