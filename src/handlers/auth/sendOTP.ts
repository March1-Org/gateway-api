import { error, t } from 'elysia';
import type Redis from 'ioredis';
import type { authApi, mockAuthApi } from 'lib/apis/auth';
import type { AuthRateLimit } from 'utils/rateLimit/auth/type';
import type { JwtType } from 'utils/types/jwt';

export const sendOTPBody = t.Object({
  phoneNumber: t.String(),
});

type Options = {
  authApp: typeof authApi | typeof mockAuthApi;
  body: typeof sendOTPBody.static;
  jwtAuth: JwtType;
  rateLimit: AuthRateLimit;
  cache: Redis;
};

export async function sendOTP({
  authApp,
  body: { phoneNumber },
  jwtAuth,
  rateLimit,
  cache,
}: Options) {
  const limitReached = await rateLimit({ cache, phoneNumber });
  if (limitReached) return limitReached;
  const token = await jwtAuth.sign({ phoneNumber });
  const { data, error: err } = await authApp.auth.sendOTP.post({
    token,
  });
  if (err) {
    return error(err.status, err.value);
  }
  return data;
}
