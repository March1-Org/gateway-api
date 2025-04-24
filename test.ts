import { treaty } from '@elysiajs/eden';
import { authApp } from '@march1-org/auth-api';

const { data, error } = await treaty(authApp).auth.sendOTP.post({ token: '' });
console.log(data, error);
