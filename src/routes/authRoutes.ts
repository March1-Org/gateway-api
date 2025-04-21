import type { AuthApp } from '@march1-org/auth-api';
import type { AuthSchema, AuthSchemaBodies } from '@march1-org/auth-db';
import Elysia from 'elysia';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';

type Options = {
  authApp: AuthApp;
  authDb: DbType;
  authSchemaBodies: AuthSchemaBodies;
  authSchema: AuthSchema;
  cache: Redis;
};

export async function authRoutes({ authApp, cache }: Options) {
  return new Elysia({ prefix: '/auth' }).decorate('authApp', authApp);
}
