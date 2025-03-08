import { db, dbBodies } from "./db";
import { createApp } from "./createApp";
import { schema } from "./db/schema";

const app = createApp({ db, dbBodies, schema }).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
type TemplateApp = typeof app;

export { app };
export type { TemplateApp };
