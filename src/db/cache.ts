import Redis from "ioredis";
import { config } from "config";

export function getCache() {
  return new Redis({
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB,
  });
}
