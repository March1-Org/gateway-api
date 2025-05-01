import { treaty } from '@elysiajs/eden';
import jwt from '@elysiajs/jwt';
import {
  Auth,
  createAuthApp,
  getAuth,
  validatePhoneNumber,
  type AuthApp,
} from '@march1-org/auth-api';
import { config } from 'config';
import { getDb } from 'lib/db';

import { mockSendOTP } from '../../../test/utils/mockSendOTP';

export const authApi = treaty<AuthApp>('');
const authInstance = getAuth({ sendOTP: mockSendOTP, db: await getDb(config) });
const auth = new Auth(authInstance.api, validatePhoneNumber);
const authApp = createAuthApp({
  auth,
  config,
});

const authAuthorization = await jwt({
  secret: config.JWT_AUTH_SECRET,
}).decorator.jwt.sign({ apiPassword: config.AUTH_API_PASSWORD });

export const mockAuthApi = treaty(authApp, {
  headers: { authorization: authAuthorization },
});
