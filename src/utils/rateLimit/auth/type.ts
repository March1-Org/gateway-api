import type { ElysiaCustomStatusResponse } from 'elysia/error';
import type Redis from 'ioredis';

export type AuthRateLimit = (options: {
  cache: Redis;
  ip: string;
  phoneNumber: string;
}) => Promise<void | ElysiaCustomStatusResponse<429>>;
