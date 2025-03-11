import { describe, it, expect } from "bun:test";
import { getTestContext } from "./utils/getTestContext";

const context = JSON.parse(
  await Bun.file("./test/context/context.json").text()
);

console.log("creating test context");
const api = await getTestContext({
  containerId: context.containerId,
});
console.log("context created");

describe("GET /users/:id", () => {
  // let api: ReturnType<typeof treaty<typeof app>>;

  // beforeAll(async () => {
  //   const context = JSON.parse(
  //     await Bun.file("./test/context/context.json").text()
  //   );

  //   console.log("creating test context");
  //   api = await getTestContext({
  //     containerId: context.containerId,
  //   });
  //   console.log("context created");
  // });

  it("returns 'Unauthorized' when provided the wrong authorization header", async () => {
    const userId = 1;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization: "",
      },
    });

    expect(res.error?.value as string).toBe("Unauthorized");
    expect(res.error?.status as number).toBe(401);
  });

  it("returns 'User not found' error when user doesn't exist", async () => {
    const userId = 2;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization: "",
      },
    });

    expect(res.error?.value).toBe("User not found.");
    expect(res.error?.status).toBe(404);
  });

  it("returns user row", async () => {
    const userId = 1;

    const res = await api.users({ id: userId }).get({
      headers: {
        authorization: "",
      },
    });

    expect(res.data).toEqual({
      id: 1,
      age: 24,
      email: "test.email@.com",
      name: "Alonzo",
    });
    expect(res.status).toBe(200);
    expect(res.error).toBeNull();
  });
});
