export function generateTestE2EContent(
  capturedRoute: string,
  capturedMethod: string,
  payloadString: string,
  formattedExpectedContent: string,
  formattedInvalidPayload: string,
) {
  if (formattedInvalidPayload) {
    return `import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("${capturedRoute} route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await request(app.server).${capturedMethod}("${capturedRoute}")${payloadString ? `.send({${payloadString}})` : ""}.expect(201);

    expect(response.body).toEqual({
    ${formattedExpectedContent},
    });
  });

  it("should return 400 when sending invalid types", async () => {
    const response = await request(app.server).${capturedMethod}("${capturedRoute}").send({${formattedInvalidPayload}}).expect(400);

    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("error", "Bad Request");
    expect(response.body).toHaveProperty("code", "FST_ERR_VALIDATION");
  });
});
`;
  }

  return `import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("${capturedRoute} route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await request(app.server).${capturedMethod}("${capturedRoute}")${payloadString ? `.send({${payloadString}})` : ""}.expect(201);

    expect(response.body).toEqual({
    ${formattedExpectedContent},
    });
  });
});
`;
}
