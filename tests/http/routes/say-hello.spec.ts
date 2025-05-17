import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("/say-hello route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/say-hello",
      payload: {
        name: "Mocked User",
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      message: "Hello Mocked User",
    });
  });
});
