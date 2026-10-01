import dotenv from 'dotenv';
dotenv.config();
const required: string[] = [];

const env = process.env.NODE_ENV ?? 'development';

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing environment variable: ${key}`);
  }
}

export const config = {
  env,
  port: Number(process.env.PORT ?? 3000),
  chaos: process.env.CHAOS === 'true',
} as const;
