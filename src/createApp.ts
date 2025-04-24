import jwt from '@elysiajs/jwt';
import { config } from 'config';
import Elysia from 'elysia';
import type Redis from 'ioredis';
import type { authApi, mockAuthApi } from 'lib/apis/auth';
import { authRoutes } from 'routes/authRoutes';

type Options = {
  // db: DbType;
  // schemaBodies: SchemaBodies;
  // schema: Schema;
  cache: Redis;
  authApp: typeof authApi | typeof mockAuthApi;
};

export function createApp({ authApp, cache }: Options) {
  return new Elysia()
    .use(
      jwt({
        secret: config.JWT_SECRET!,
      })
    )
    .use(authRoutes({ cache, authApp }));
}
