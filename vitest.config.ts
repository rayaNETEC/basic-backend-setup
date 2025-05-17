// vitest.config.mts (ou .ts se você não mudou a extensão)
import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vitest/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.spec.ts", "tests/**/*.e2e.ts"],
  },
  resolve: {
    alias: {
      "#": path.resolve(__dirname, "./src"),
    },
  },
});
