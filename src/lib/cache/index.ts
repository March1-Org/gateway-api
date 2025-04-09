import { config } from 'config';
import Redis from 'ioredis';

export function getCache() {
  return new Redis({
    port: config.REDIS_PORT,
    host: config.REDIS_HOST,
    password: config.REDIS_PASSWORD,
    db: config.REDIS_DB,
  });
}
