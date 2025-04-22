import { treaty } from '@elysiajs/eden';
import { authApp, type AuthApp } from '@march1-org/auth-api';

export const authApi = treaty<AuthApp>('');
export const mockAuthApi = treaty(authApp);
