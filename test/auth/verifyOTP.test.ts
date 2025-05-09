import { treaty } from '@elysiajs/eden';
import { authSchema } from '@march1-org/auth-db';
import { describe, it, expect, beforeAll } from 'bun:test';
import type { createApp } from 'createApp';
import type { DbType } from 'lib/db';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<ReturnType<typeof createApp>>>;

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;

  await db.delete(authSchema.users);
  await db.delete(authSchema.sessions);
  await db.delete(authSchema.verifications);

  const body = {
    phoneNumber: '+12345678910',
  };
  await api.auth.sendOTP.post(body);
});

describe('GET /auth/verifyOTP', () => {
  it('Should catch a failed request', async () => {
    const body = {
      phoneNumber: '1',
      code: '1',
    };
    const res = await api.auth.verifyOTP.post(body);

    expect(res.error?.value).toEqual({
      name: 'BetterCallAPIError',
      message: 'API Error: BAD_REQUEST OTP not found',
      cause: {
        message: 'OTP not found',
        code: 'OTP_NOT_FOUND',
      },
    });
    expect(res.error?.status).toEqual(400);
  });

  it('Should verify OTP for a valid token', async () => {
    const verification = (await db.select().from(authSchema.verifications))[0];

    const body = {
      phoneNumber: verification.identifier,
      code: verification.value,
    };
    const res = await api.auth.verifyOTP.post(body);

    expect(res.status).toEqual(200);
    expect(res.data).toBeString();
  });
});
