import type { Schema, SchemaBodies } from '@march1-org/db-template';
import Elysia, { t } from 'elysia';
import { deleteUser } from 'handlers/users/deleteUser';
import { getUser } from 'handlers/users/getUser';
import { getUsers, getUsersQuery } from 'handlers/users/getUsers';
import { patchUser } from 'handlers/users/patchUser';
import { postUser } from 'handlers/users/postUser';
import type Redis from 'ioredis';
import type { DbType } from 'lib/db';

type Options = {
  db: DbType;
  schemaBodies: SchemaBodies;
  schema: Schema;
  cache: Redis;
};

export async function userRoutes({ db, schemaBodies, schema, cache }: Options) {
  return new Elysia({ prefix: '/users' })
    .decorate('db', db)
    .decorate('schemaBodies', schemaBodies)
    .decorate('schema', schema)
    .decorate('cache', cache)
    .get('', (options) => getUsers(options), {
      query: getUsersQuery,
      detail: {
        summary: 'Selects users in a page',
      },
    })
    .get('/:id', (options) => getUser(options))
    .post('', (options) => postUser(options), {
      body: t.Object(schemaBodies.insert.users),
    })
    .patch('/:id', (options) => patchUser(options), {
      body: t.Object(schemaBodies.update.users),
    })
    .delete('/:id', (options) => deleteUser(options));
}
