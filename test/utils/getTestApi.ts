import { createApp } from "@/createApp";
import { getMockDb } from "./getMockDb";
import { schema } from "@/db/schema";
import { dbBodies } from "@/db";
import { treaty } from "@elysiajs/eden";

export async function getTestApi() {
  const mockDb = await getMockDb();
  console.log("db created");
  const app = createApp({
    db: mockDb,
    dbBodies,
    schema,
  });

  console.log("app created");

  const api = treaty(app);
  console.log("api created");
  console.log(await api.users({ id: 1 }).get());
  return api;
}
