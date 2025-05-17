import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
import { pathToFileURL } from "url";

import { formatObjectContent, toKebabCase } from "#/utils/format.js";
import { getCurrentFilePaths, resolveProjectPaths } from "#/utils/paths.js";

import { generateTestE2EContent } from "./templates/test-e2e-content.js";
import { generateTestUnitContent } from "./templates/test-unit-content.js";

(async function main() {
  const { __dirname } = getCurrentFilePaths(import.meta.url);
  const { tsConfigPath, routesDir, testsDir, mockDir } =
    resolveProjectPaths(__dirname);

  const project = new Project({ tsConfigFilePath: tsConfigPath });

  fs.mkdirSync(testsDir, { recursive: true });

  project.addSourceFilesAtPaths(path.join(routesDir, "*.ts"));
  const sourceFiles = project.getSourceFiles();

  for (const file of sourceFiles) {
    const functions = file.getFunctions();

    if (!file.getFilePath().includes("/routes/")) continue;
    for (const func of functions) {
      const funcName = func.getName();
      if (!funcName) continue;

      const filePath = file.getFilePath();
      const routeModule = await import(pathToFileURL(filePath).href);
      const routeFunction = routeModule[funcName];
      if (!routeFunction) continue;

      let capturedRoute = "/";
      let capturedMethod = "get";

      const mockApp = {
        withTypeProvider: () => ({
          get: (route: string) => {
            capturedRoute = route;
            capturedMethod = "get";
          },
          post: (route: string) => {
            capturedRoute = route;
            capturedMethod = "post";
          },
          put: (route: string) => {
            capturedRoute = route;
            capturedMethod = "put";
          },
          delete: (route: string) => {
            capturedRoute = route;
            capturedMethod = "delete";
          },
        }),
      };

      await routeFunction(mockApp);

      const fileName = toKebabCase(funcName);

      const mockFilePath = path.join(mockDir, `${fileName}.ts`);

      if (!fs.existsSync(mockFilePath)) {
        continue;
      }

      const mockModule = await import(pathToFileURL(mockFilePath).href);
      const payload = mockModule.mockPayload;
      const expectedResponse = mockModule.mockResponse;

      if (!expectedResponse) {
        continue;
      }

      const formattedPayloadContent = payload
        ? formatObjectContent(payload, 0, 2)
        : "";

      const testUnitContent = generateTestUnitContent(
        capturedRoute,
        capturedMethod,
        payload
          ? `,\n      payload: {
        ${formattedPayloadContent},
      }`
          : "",
        formatObjectContent(expectedResponse, 0, 2),
      );

      const testE2EContent = generateTestE2EContent(
        capturedRoute,
        capturedMethod,
        formattedPayloadContent,
        formatObjectContent(expectedResponse, 1, 2),
      );

      const testUnitFilePath = path.join(testsDir, `${fileName}.spec.ts`);
      const testE2EFilePath = path.join(testsDir, `${fileName}.e2e.ts`);
      const testUnitExists = fs.existsSync(testUnitFilePath);
      const testE2EExists = fs.existsSync(testE2EFilePath);

      if (testUnitExists) {
        console.log(`Unit test already exists: ${fileName}.spec.ts`);
      } else {
        fs.writeFileSync(testUnitFilePath, testUnitContent);
        console.log(`Unit test generated: ${fileName}.spec.ts`);
      }

      if (testE2EExists) {
        console.log(`E2E test already exists: ${fileName}.e2e.ts`);
      } else {
        fs.writeFileSync(testE2EFilePath, testE2EContent);
        console.log(`E2E test generated: ${fileName}.e2e.ts`);
      }
    }
  }
})();
