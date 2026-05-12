import 'dotenv/config';

const REQUIRED = ['DATABASE_URL', 'PORT', 'BASE_URL'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(
    `Шаардлагатай орчны хувьсагч дутуу байна: ${missing.join(', ')}. .env.example-ийг харна уу.`,
  );
}

export const env = Object.freeze({
  databaseUrl: process.env.DATABASE_URL,
  port: Number.parseInt(process.env.PORT, 10),
  baseUrl: process.env.BASE_URL.replace(/\/$/, ''),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  isProduction: process.env.NODE_ENV === 'production',
});
