import { treaty } from '@elysiajs/eden';
import jwt from '@elysiajs/jwt';
import { schemaBodies, schema } from '@march1-org/db-template';
import { config } from 'config';
import { createApp } from 'createApp';
import { getCache } from 'lib/cache';
import { getDb } from 'lib/db';

export async function setup() {
  const db = await getDb();
  const cache = getCache();
  const app = createApp({
    db,
    schemaBodies,
    schema,
    cache,
  });

  const api = treaty(app);

  const authorization = await jwt({
    secret: config.JWT_SECRET,
  }).decorator.jwt.sign({ apiPassword: config.API_PASSWORD });

  return { db, api, authorization };
}
