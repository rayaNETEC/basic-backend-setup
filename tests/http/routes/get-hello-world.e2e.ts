import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("/hello-world route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await request(app.server).get("/hello-world").expect(201);

    expect(response.body).toEqual({
      message: "Hello World",
    });
  });
});
