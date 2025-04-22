import jwt from '@elysiajs/jwt';
import { config } from 'config';
import Elysia from 'elysia';
import { sendOTP, sendOTPBody } from 'handlers/auth/sendOTP';
import type Redis from 'ioredis';
import type { authApi, mockAuthApi } from 'lib/apis/auth';
import { deriveIp } from 'utils/deriveIp';
import { sendOTPRateLimit } from 'utils/rateLimit/auth/sendOTP';

type Options = {
  authApp: typeof authApi | typeof mockAuthApi;
  cache: Redis;
};

export async function authRoutes({ authApp, cache }: Options) {
  return new Elysia({ prefix: '/auth' })
    .decorate('authApp', authApp)
    .decorate('cache', cache)
    .derive((options) => deriveIp(options))
    .use(
      jwt({
        secret: config.AUTH_JWT_SECRET!,
        name: 'jwtAuth',
      })
    )
    .post(
      '/sendOTP',
      (options) => sendOTP({ ...options, rateLimit: sendOTPRateLimit }),
      { body: sendOTPBody }
    );
}
