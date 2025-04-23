import { error, t } from 'elysia';
import type Redis from 'ioredis';
import type { authApi, mockAuthApi } from 'lib/apis/auth';
import type { AuthRateLimit } from 'utils/rateLimit/auth/type';
import type { JwtType } from 'utils/types/jwt';

export const verifyOTPBody = t.Object({
  phoneNumber: t.String(),
  code: t.String(),
});

type Options = {
  authApp: typeof authApi | typeof mockAuthApi;
  body: typeof verifyOTPBody.static;
  jwtAuth: JwtType;
  ip: string;
  rateLimit: AuthRateLimit;
  cache: Redis;
};

export async function verifyOTP({
  authApp,
  body: { phoneNumber, code },
  jwtAuth,
  ip,
  rateLimit,
  cache,
}: Options) {
  const limitReached = await rateLimit({ cache, ip, phoneNumber });
  if (limitReached) return limitReached;
  const token = await jwtAuth.sign({ phoneNumber, code });
  const { data, error: err } = await authApp.auth.verifyOTP.post({
    token,
  });
  if (err) {
    return error(err.status, err.value);
  }
  return data;
}
