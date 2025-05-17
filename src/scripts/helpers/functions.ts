/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/generate-invalid-payload.ts
import { z } from "zod";

export function generateInvalidPayload(schema: z.ZodTypeAny): any {
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape;
    const invalid: Record<string, any> = {};
    for (const key in shape) {
      const value = shape[key];
      if (value instanceof z.ZodString) {
        invalid[key] = 123;
      } else if (value instanceof z.ZodNumber) {
        invalid[key] = "invalid";
      } else {
        invalid[key] = null;
      }
    }
    return invalid;
  }
  return {};
}
