import { treaty } from '@elysiajs/eden';
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

  return { db, api };
}
