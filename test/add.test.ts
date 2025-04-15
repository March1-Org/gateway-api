// import type { treaty } from '@elysiajs/eden';
// import { beforeAll, describe, expect, it } from 'bun:test';
// import type { app } from 'index';

// import { setup } from './utils/setup';

// let api: ReturnType<typeof treaty<typeof app>>;

// beforeAll(async () => {
//   const setupVals = await setup();
//   api = setupVals.api;
// });

// describe('POST /add', () => {
//   it('Should add 1 + 2 and return 3', async () => {
//     const res = await api.add.post({ a: 1, b: 2 });

//     expect(res.data).toBe(3);
//     expect(res.status).toBe(200);
//   });
// });
