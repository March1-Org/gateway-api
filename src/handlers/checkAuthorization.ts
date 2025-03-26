import { config } from 'config';
import { error } from 'elysia';
import type { JwtType } from 'utils/types/jwt';

type Options = {
  request: Request;
  jwt: JwtType;
};

export async function checkAuthorization({ request, jwt }: Options) {
  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return error('Unauthorized');
  }
  const authorized = await jwt.verify(authorization);
  if (!authorized) {
    return error('Unauthorized');
  }

  const { apiPassword } = authorized;

  if (!apiPassword) {
    return error('Unauthorized');
  }

  if (apiPassword !== config.API_PASSWORD) {
    return error('Unauthorized');
  }
}
