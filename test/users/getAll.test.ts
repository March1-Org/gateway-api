import { treaty } from '@elysiajs/eden';
import { faker } from '@faker-js/faker';
import { schema } from '@march1-org/db-template';
import type { UserInsert } from '@march1-org/db-template/users';
import { describe, it, expect, beforeAll, beforeEach } from 'bun:test';
import type { app } from 'index';
import type { DbType } from 'lib/db';
import type { UserResult } from 'utils/types/user';

import { setup } from '../utils/setup';

let db: DbType;
let api: ReturnType<typeof treaty<typeof app>>;
let authorization: string;
let bulkUsersInsert: UserInsert[];
let bulkUsers: UserResult[];

beforeAll(async () => {
  const setupVals = await setup();
  db = setupVals.db;
  api = setupVals.api;
  authorization = setupVals.authorization;

  await db.delete(schema.users);
});

beforeEach(async () => {
  await db.delete(schema.users);
  bulkUsersInsert = Array.from({ length: 25 }, () => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    age: faker.number.int({ min: 18, max: 99 }),
  }));

  const userData = await db
    .insert(schema.users)
    .values(bulkUsersInsert)
    .returning();

  bulkUsers = userData.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    updatedAt: null,
    deletedAt: null,
  }));
});

describe('GET /users with pagination', () => {
  it('returns first page with default limit (10)', async () => {
    const res = await api.users.get({
      query: {},
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(10);
    expect(res.data).toEqual(bulkUsers.slice(0, 10));
    expect(res.status).toBe(200);
  });

  it('returns second page with default limit', async () => {
    const res = await api.users.get({
      query: { page: 2 },
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(10);
    expect(res.data).toEqual(bulkUsers.slice(10, 20));
    expect(res.status).toBe(200);
  });

  it('returns custom limit of users', async () => {
    const customLimit = 5;
    const res = await api.users.get({
      query: { limit: customLimit },
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(customLimit);
    expect(res.data).toEqual(bulkUsers.slice(0, customLimit));
    expect(res.status).toBe(200);
  });

  it('returns second page with custom limit', async () => {
    const customLimit = 7;
    const res = await api.users.get({
      query: { page: 2, limit: customLimit },
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(customLimit);
    expect(res.data).toEqual(bulkUsers.slice(customLimit, customLimit * 2));
    expect(res.status).toBe(200);
  });

  it('returns empty array when page exceeds data', async () => {
    const res = await api.users.get({
      query: { page: 100 },
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(0);
    expect(res.status).toBe(200);
  });

  it('returns all users when limit exceeds total count', async () => {
    const res = await api.users.get({
      query: { limit: 100 },
      headers: {
        authorization,
      },
    });

    expect(res.data).toBeArrayOfSize(bulkUsers.length);
    expect(res.data).toEqual(bulkUsers);
    expect(res.status).toBe(200);
  });

  it('handles invalid page number gracefully', async () => {
    const res = await api.users.get({
      query: { page: -1 },
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe('Page must be a positive integer');
    expect(res.status).toBe(400);
  });

  it('handles invalid limit gracefully', async () => {
    const res = await api.users.get({
      query: { limit: -5 },
      headers: {
        authorization,
      },
    });

    expect(res.error?.value).toBe('Limit must be a positive integer');
    expect(res.status).toBe(400);
  });
});
