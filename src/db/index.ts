import { spreads } from "../utils/spread";
import { drizzle } from "drizzle-orm/node-postgres";
import { schema } from "./schema";

export const db = drizzle(process.env.DATABASE_URL!);

export type DbType = typeof db;

export const dbBodies = {
  insert: spreads(schema, "insert"),
  select: spreads(schema, "select"),
  update: spreads(schema, "update"),
};

export type DbBodies = typeof dbBodies;
