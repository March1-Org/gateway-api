import type { Server } from 'bun';
import { error, type Context } from 'elysia';

type Options = {
  server: Server | null;
  request: Context['request'];
};

export function deriveIp({ server, request }: Options) {
  const ip = server?.requestIP(request);
  if (!ip) {
    return error('Bad Gateway', 'Invalid IP');
  }
  return {
    ip: ip.address,
  };
}
