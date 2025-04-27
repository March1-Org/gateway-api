import { treaty } from '@elysiajs/eden';
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
export const mockAuthApi = treaty(authApp);
