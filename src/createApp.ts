import jwt from '@elysiajs/jwt';
import type { Schema, SchemaBodies } from '@march1-org/db-template';
import { config } from 'config';
import Elysia from 'elysia';
import { add, addBody } from 'handlers/add';
import { checkAuthorization } from 'handlers/checkAuthorization';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';
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
    .post('/add', (options) => add(options), {
      body: addBody,
    })
    .onBeforeHandle((options) => checkAuthorization(options))
    .use(userRoutes({ cache, db, schema, schemaBodies }));
}
