import { db } from "./db";
import { createApp } from "./createApp";
import { schemaBodies, schema } from "./db/schema";
import { cache } from "./db/cache";

const app = createApp({ db, schemaBodies, schema, cache }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
type TemplateApp = typeof app;

export { app };
export type { TemplateApp };
