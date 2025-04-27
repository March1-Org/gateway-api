import { treaty } from '@elysiajs/eden';
import jwt from '@elysiajs/jwt';
import { config } from 'config';
import { createApp } from 'createApp';
import { mockAuthApi } from 'lib/apis/auth';
import { getCache } from 'lib/cache';
import { getDb } from 'lib/db';

export async function setup() {
  const db = await getDb(config);
  const cache = getCache();
  const app = createApp({
    authApp: mockAuthApi,
    cache,
  });

  const api = treaty(app);

  const authorization = await jwt({
    secret: config.JWT_SECRET,
  }).decorator.jwt.sign({ apiPassword: config.API_PASSWORD });

  return { db, api, authorization };
}
