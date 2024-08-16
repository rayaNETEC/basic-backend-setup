import pluginJs from "@eslint/js";
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from "globals";
import tseslint from "typescript-eslint";


export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  { plugins: { 'simple-import-sort': simpleImportSort } },
  {
    rules: {
      'simple-import-sort/imports': 'error',
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];