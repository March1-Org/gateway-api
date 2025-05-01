import { error } from 'elysia';
import type Redis from 'ioredis';

const VERIFY_OTP_RATE_LIMIT_MAX_REQUESTS = 1;
const VERIFY_OTP_RATE_LIMIT_WINDOW = 60;

type Options = {
  cache: Redis;
  phoneNumber: string;
};

export async function verifyOTPRateLimit({ cache, phoneNumber }: Options) {
  const phoneNumberKey = `rate-limit-send-otp${phoneNumber}`;

  const phoneNumberRequests = await cache.incr(phoneNumberKey);

  if (phoneNumberRequests === 1) {
    cache.expire(phoneNumberKey, VERIFY_OTP_RATE_LIMIT_WINDOW);
  }
  if (phoneNumberRequests > VERIFY_OTP_RATE_LIMIT_MAX_REQUESTS) {
    return error('Too Many Requests');
  }
}
