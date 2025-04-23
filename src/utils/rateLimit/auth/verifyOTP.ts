import { error } from 'elysia';
import type Redis from 'ioredis';

const VERIFY_OTP_RATE_LIMIT_MAX_REQUESTS = 0;
const VERIFY_OTP_RATE_LIMIT_WINDOW = 0;

type Options = {
  cache: Redis;
  ip: string;
  phoneNumber: string;
};

export async function verifyOTPRateLimit({ cache, ip, phoneNumber }: Options) {
  const ipKey = `rate-limit-send-otp:${ip}`;
  const phoneNumberKey = `rate-limit-send-otp${phoneNumber}`;

  const ipRequests = await cache.incr(ipKey);
  const phoneNumberRequests = await cache.incr(phoneNumberKey);
  if (ipRequests === 1) {
    cache.expire(ipKey, VERIFY_OTP_RATE_LIMIT_WINDOW);
  }
  if (phoneNumberRequests === 1) {
    cache.expire(phoneNumberKey, VERIFY_OTP_RATE_LIMIT_WINDOW);
  }
  if (
    ipRequests > VERIFY_OTP_RATE_LIMIT_MAX_REQUESTS ||
    phoneNumberRequests > VERIFY_OTP_RATE_LIMIT_MAX_REQUESTS
  ) {
    return error('Too Many Requests');
  }
}
