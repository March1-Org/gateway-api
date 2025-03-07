import { templateApi } from "@/index";
import { describe, expect, it } from "bun:test";

describe("Template Tests", () => {
  it("return a response", async () => {
    const { data } = await templateApi.index.get();

    expect(data).toBe("Hello Elysia");
  });

  it("returns users", async () => {
    const { data } = await templateApi.users.get();
    console.log(data);
    expect(data);
  });
});
