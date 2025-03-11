import { createApp } from "@/createApp";
import { getMockDb } from "./getMockDb";
import { schema } from "@/db/schema";
import { dbBodies } from "@/db";
import { treaty } from "@elysiajs/eden";

type Options = {
  containerId: string;
};

export async function getTestContext({ containerId }: Options) {
  const mockDb = await getMockDb({ containerId });
  console.log("db created");
  const app = createApp({
    db: mockDb,
    dbBodies,
    schema,
  });

  console.log("app created");

  const api = treaty(app);
  console.log("api created");

  return api;
}
