import { spreads } from "../utils/spread";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";
import { Client } from "pg";

const client = new Client({
  host: "127.0.0.1",
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});
await client.connect();

export const db = drizzle(client);

export type DbType = typeof db;

export const dbBodies = {
  insert: spreads(schema, "insert"),
  select: spreads(schema, "select"),
  update: spreads(schema, "update"),
};

export type DbBodies = typeof dbBodies;
