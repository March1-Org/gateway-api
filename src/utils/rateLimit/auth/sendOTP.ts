import { error } from 'elysia';
import type Redis from 'ioredis';

const SEND_OTP_RATE_LIMIT_MAX_REQUESTS = 0;
const SEND_OTP_RATE_LIMIT_WINDOW = 0;

type Options = {
  cache: Redis;
  phoneNumber: string;
};

export async function sendOTPRateLimit({ cache, phoneNumber }: Options) {
  const phoneNumberKey = `rate-limit-send-otp${phoneNumber}`;

  const phoneNumberRequests = await cache.incr(phoneNumberKey);
  if (phoneNumberRequests === 1) {
    cache.expire(phoneNumberKey, SEND_OTP_RATE_LIMIT_WINDOW);
  }
  if (phoneNumberRequests > SEND_OTP_RATE_LIMIT_MAX_REQUESTS) {
    return error('Too Many Requests');
  }
}
