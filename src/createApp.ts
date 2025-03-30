import jwt from '@elysiajs/jwt';
import { config } from 'config';
import type { DbType } from 'db';
import type { Schema, SchemaBodies } from 'db/schema';
import Elysia from 'elysia';
import { checkAuthorization } from 'handlers/checkAuthorization';
import type Redis from 'ioredis';
import { userRoutes } from 'routes/usersRoutes';

type Options = {
  db: DbType;
  schemaBodies: SchemaBodies;
  schema: Schema;
  cache: Redis;
};

export function createApp({ db, schemaBodies, schema, cache }: Options) {
  return new Elysia()
    .use(
      jwt({
        secret: config.JWT_SECRET!,
      })
    )
    .onBeforeHandle((options) => checkAuthorization(options))
    .use(userRoutes({ cache, db, schema, schemaBodies }));
}
