import jwt from '@elysiajs/jwt';
import { config } from 'config';
import Elysia from 'elysia';
import { sendOTP, sendOTPBody } from 'handlers/auth/sendOTP';
import { verifyOTP, verifyOTPBody } from 'handlers/auth/verifyOTP';
import type Redis from 'ioredis';
import type { authApi, mockAuthApi } from 'lib/apis/auth';
import { sendOTPRateLimit } from 'utils/rateLimit/auth/sendOTP';
import { verifyOTPRateLimit } from 'utils/rateLimit/auth/verifyOTP';

type Options = {
  authApp: typeof authApi | typeof mockAuthApi;
  cache: Redis;
};

export async function authRoutes({ authApp, cache }: Options) {
  return (
    new Elysia({ prefix: '/auth' })
      .decorate('authApp', authApp)
      .decorate('cache', cache)
      // .derive((options) => deriveIp(options))
      .use(
        jwt({
          secret: config.JWT_AUTH_SECRET,
          name: 'jwtAuth',
        })
      )
      .post(
        '/sendOTP',
        (options) => sendOTP({ ...options, rateLimit: sendOTPRateLimit }),
        { body: sendOTPBody }
      )
      .post(
        '/verifyOTP',
        (options) => verifyOTP({ ...options, rateLimit: verifyOTPRateLimit }),
        { body: verifyOTPBody }
      )
  );
}
