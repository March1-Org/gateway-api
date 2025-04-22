import { error } from 'elysia';
import type Redis from 'ioredis';

const SEND_OTP_RATE_LIMIT_MAX_REQUESTS = 0;
const SEND_OTP_RATE_LIMIT_WINDOW = 0;

type Options = {
  cache: Redis;
  ip: string;
  phoneNumber: string;
};

export async function sendOTPRateLimit({ cache, ip, phoneNumber }: Options) {
  const ipKey = `rate-limit-send-otp:${ip}`;
  const phoneNumberKey = `rate-limit-send-otp${phoneNumber}`;

  const ipRequests = await cache.incr(ipKey);
  const phoneNumberRequests = await cache.incr(phoneNumberKey);
  if (ipRequests === 1) {
    cache.expire(ipKey, SEND_OTP_RATE_LIMIT_WINDOW);
  }
  if (phoneNumberRequests === 1) {
    cache.expire(phoneNumberKey, SEND_OTP_RATE_LIMIT_WINDOW);
  }
  if (
    ipRequests > SEND_OTP_RATE_LIMIT_MAX_REQUESTS ||
    phoneNumberRequests > SEND_OTP_RATE_LIMIT_MAX_REQUESTS
  ) {
    return error('Too Many Requests');
  }
}
