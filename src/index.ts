import { createApp } from 'createApp';
import { authApi } from 'lib/apis/auth';
import { getCache } from 'lib/cache';

const cache = getCache();

const app = createApp({ cache, authApp: authApi }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
type App = typeof app;

export { app };
export type { App };
