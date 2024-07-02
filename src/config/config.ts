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
    GAME_API_ZENITH_WALLET_USERNAME: Joi.string().description('Zenith Wallet Username'),
    GAME_API_ZENITH_WALLET_PASSWORD: Joi.string().description('Zenith Wallet Password'),
    GAME_API_ZENITH_WALLET_BASIC: Joi.string().required().description('Zenith Wallet Basic Token'),
    GAME_API_ZENITH_PLATFORM_USERNAME: Joi.string().description('Zenith Platform Username'),
    GAME_API_ZENITH_PLATFORM_PASSWORD: Joi.string().description('Zenith Platform Password'),
    GAME_API_ZENITH_PLATFORM_BASIC: Joi.string().required().description('Zenith Platform Basic Token'),
    GAME_API_ZENITH_KEY: Joi.string().required().description('Zenith API KEY'),
    GAME_API_ZENITH_URI: Joi.string().required().description('Zenith URI'),
    GAME_API_ZENITH_EXIT_URI: Joi.string().required().description('Game Lobby'),
    GAME_API_ZENITH_DEPOSIT_URI: Joi.string().required().description('Deposit Page'),
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
      wallet: {
        basic: envVars.GAME_API_ZENITH_WALLET_BASIC
      },
      operation: {
        basic: envVars.GAME_API_ZENITH_PLATFORM_BASIC,
      },
      uri: envVars.GAME_API_ZENITH_URI,
      apiKey: envVars.GAME_API_ZENITH_KEY,
      exitURI: envVars.GAME_API_ZENITH_EXIT_URI,
      depositURI: envVars.GAME_API_ZENITH_DEPOSIT_URI,
    }
  },
};

export default config;
