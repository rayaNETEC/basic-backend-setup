import request from "supertest";
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
    const response = await request(app.server).post("/say-hello").send({name: "Mocked User"}).expect(201);

    expect(response.body).toEqual({
      message: "Hello Mocked User",
    });
  });

  it("should return 400 when sending invalid types", async () => {
    const response = await request(app.server).post("/say-hello").send({  name: 123}).expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("error", "Bad Request");
    expect(response.body).toHaveProperty("code", "FST_ERR_VALIDATION");
  });
});
