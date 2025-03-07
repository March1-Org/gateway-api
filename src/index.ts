import { treaty } from "@elysiajs/eden";
import { Elysia } from "elysia";
import { db } from "./db";
import { usersTable } from "./db/schema/users";

const app = new Elysia()
  .get("/", () => "Hello Elysia")
  .get("/users", async () => {
    return await db.select().from(usersTable);
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

const templateApi = treaty(app);
type TemplateApp = typeof app;

export { templateApi };
export type { TemplateApp };
