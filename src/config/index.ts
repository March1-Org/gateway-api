import dotenv from "dotenv";
import path from "path";

// Load the correct .env file based on NODE_ENV
const envFile = `.env.${process.env.NODE_ENV || "development"}`;
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Define the configuration interface
interface Config {
  NODE_ENV: string;
  PORT: number;
  TEMPLATE_JWT_SECRET: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  POSTGRES_PORT: number;
  DATABASE_URL: string;
  REDIS_PORT: number;
  REDIS_URL: string;
  REDIS_PASSWORD: string;
  REDIS_DATABASE: number;
}

// Export the configuration
export const config: Config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT || "3000"),
  TEMPLATE_JWT_SECRET: process.env.TEMPLATE_JWT_SECRET || "template-jwt-secret",
  POSTGRES_USER: process.env.POSTGRES_USER || "template_db_user",
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || "template_db_pass",
  POSTGRES_DB: process.env.POSTGRES_DB || "template_db",
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT || "5432"),
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgres://template_db_user:template_db_pass@localhost:5432/template_db",
  REDIS_PORT: parseInt(process.env.REDIS_PORT || "6379"),
  REDIS_URL: process.env.REDIS_URL || "localhost",
  REDIS_PASSWORD: process.env.REDIS_PASSWORD || "your_secure_password",
  REDIS_DATABASE: parseInt(process.env.REDIS_DATABASE || "0"),
};
