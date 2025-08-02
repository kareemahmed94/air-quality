import dotenv, { DotenvParseOutput } from 'dotenv'
import * as console from "node:console";

const environment = dotenv.config().parsed as DotenvParseOutput

export interface Env {
  PORT?: number
  DATABASE_URL: string
  ENABLE_SWAGGER_UI: string
  SWAGGER_AUTH_USERNAME: string
  SWAGGER_AUTH_PASSWORD: string
  IQAIR_BASE_URL: string
  IQAIR_PK: string
}

const env: Env = {
  PORT: environment.PORT ? Number(environment.PORT) : undefined,
  DATABASE_URL: environment.DATABASE_URL as string,
  ENABLE_SWAGGER_UI: environment.ENABLE_SWAGGER_UI as string,
  SWAGGER_AUTH_USERNAME: environment.SWAGGER_AUTH_USERNAME as string,
  SWAGGER_AUTH_PASSWORD: environment.SWAGGER_AUTH_PASSWORD as string,
  IQAIR_BASE_URL: environment.IQAIR_BASE_URL as string,
  IQAIR_PK: environment.IQAIR_PK as string,
}

export default env

export const checkEnvVariables = () => {
  for (const key in env) {
    if (!env[key as keyof typeof env]) console.warn(`env variable ${key} is not set`)
  }
}
