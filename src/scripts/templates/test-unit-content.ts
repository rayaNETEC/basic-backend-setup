export function generateTestUnitContent(
  capturedRoute: string,
  capturedMethod: string,
  requestBodyString: string,
  formattedExpectedContent: string,
  formattedInvalidPayload: string,
) {
  if (formattedInvalidPayload) {
    return `import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("${capturedRoute} route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await app.inject({
      method: "${capturedMethod.toUpperCase()}",
      url: "${capturedRoute}"${requestBodyString},
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      ${formattedExpectedContent},
    });
  });

  it("should return 400 when sending invalid types", async () => {
    const response = await app.inject({
      method: "${capturedMethod.toUpperCase()}",
      url: "${capturedRoute}",
      payload: {
        ${formattedInvalidPayload},
      },
    });

    expect(response.statusCode).toBe(400);
    const body = response.json();

    expect(body).toHaveProperty("code", "FST_ERR_VALIDATION");
  });
});
`;
  }

  return `import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { app } from "#/http/app.js";

describe("${capturedRoute} route", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("should return 201 and expected body", async () => {
    const response = await app.inject({
      method: "${capturedMethod.toUpperCase()}",
      url: "${capturedRoute}"${requestBodyString},
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toEqual({
      ${formattedExpectedContent},
    });
  });
});
`;
}
