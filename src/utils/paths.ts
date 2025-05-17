import path from "path";
import { fileURLToPath } from "url";

export function getCurrentFilePaths(metaUrl: string) {
  const __filename = fileURLToPath(metaUrl);
  const __dirname = path.dirname(__filename);
  return { __filename, __dirname };
}

export function resolveProjectPaths(__dirname: string) {
  const tsConfigPath = path.join(__dirname, "../../tsconfig.json");
  const routesDir = path.join(__dirname, "../http/routes");
  const testsDir = path.join(__dirname, "../../tests/http/routes");
  const mockDir = path.join(__dirname, "../mock");

  return { tsConfigPath, routesDir, testsDir, mockDir };
}
