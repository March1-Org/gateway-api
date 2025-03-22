import dotenv from "dotenv";
import path from "path";

// Load the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Define the configuration interface
interface Config {
  NODE_ENV: string;
  PORT: number;
  JWT_SECRET: string;
  API_PASSWORD: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  POSTGRES_HOST: string;
  REDIS_PORT: number;
  REDIS_HOST: string;
  REDIS_PASSWORD: string;
  REDIS_DB: number;
}

// Export the configuration
export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  JWT_SECRET: process.env.JWT_SECRET || "jwt-secret",
  API_PASSWORD: process.env.API_PASSWORD || "api-password",
  POSTGRES_USER: process.env.POSTGRES_USER || "db_user",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "db_password",
  POSTGRES_DB: process.env.POSTGRES_DB || "db",
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || "5432"),
  POSTGRES_HOST: process.env.POSTGRES_HOST || "127.0.0.1",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
  REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "cache_password",
  REDIS_DB: parseInt(process.env.REDIS_DB || "0"),
};
