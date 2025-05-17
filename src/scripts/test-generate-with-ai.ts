import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import { Project } from "ts-morph";

import { env } from "../env/index.js";

const API_KEY = env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error("No API key found.");
  process.exit(1);
}

const routesDir = path.resolve("src/http/routes");

const project = new Project();
project.addSourceFilesAtPaths(path.join(routesDir, "*.ts"));

const sourceFiles = project.getSourceFiles();

const funcNameArg = process.argv[2];

let extractedCode = "";
for (const file of sourceFiles) {
  const functions = file.getFunctions();
  for (const func of functions) {
    const name = func.getName();
    if (!name) continue;

    if (funcNameArg && name !== funcNameArg) {
      continue;
    }

    extractedCode = func.getFullText();
    console.log(`Function extracted: ${name}`);
    break;
  }
  if (extractedCode) break;
}

if (!extractedCode) {
  console.error(`Function "${funcNameArg}" not found.`);
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const prompt = `
Here is a Fastify route function that uses validation with Zod.
I am using eslint-plugin-simple-import-sort for import sorting.
Generate both a unit test and an end-to-end (E2E) test using Vitest and Supertest.

The tests should include:
- A 201 response test with valid payload.
- A 400 response test when sending invalid types, specifically a Zod validation type error.

Don't explain anything, just provide the direct test code.

${extractedCode}
`;

async function run() {
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  console.log("Tests suggested by AI:\n");
  console.log(text);
}

run();
