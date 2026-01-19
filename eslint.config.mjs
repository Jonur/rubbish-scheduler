import path from "node:path";
import { fileURLToPath } from "node:url";

import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

const baseRules = {
  "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
  "eol-last": ["error", "always"],

  "import/order": [
    "error",
    {
      groups: ["builtin", "external", "internal", ["parent", "sibling", "index"], "object"],
      "newlines-between": "always",
      alphabetize: { order: "asc", caseInsensitive: true },
    },
  ],
  "import/no-duplicates": "error",
  "import/newline-after-import": "error",
};

export default [
  { ignores: ["dist/**", "build/**", "coverage/**", "node_modules/**"] },

  // JS (CommonJS)
  {
    files: ["**/*.{js,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
    plugins: { import: importPlugin },
    rules: { ...baseRules },
  },

  // JS (ESM)
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: { ...globals.node },
    },
    plugins: { import: importPlugin },
    rules: { ...baseRules },
  },

  // TS (WITH typed linting) - src/
  {
    files: ["{api,scripts,src}/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "commonjs",
      parserOptions: {
        project: ["./tsconfig.app.json"],
        tsconfigRootDir,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.app.json"],
        },
      },
    },
    rules: {
      ...baseRules,

      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],

      "@typescript-eslint/no-floating-promises": "error",

      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
      ],
    },
  },

  // TS (WITH typed linting) - api/ and scripts/
  {
    files: ["api/**/*.ts", "scripts/**/*.ts"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "commonjs",
      parserOptions: {
        project: ["./tsconfig.node.json"],
        tsconfigRootDir,
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts"],
      },
      "import/resolver": {
        typescript: {
          project: ["./tsconfig.node.json"],
        },
      },
    },
    rules: {
      ...baseRules,
      "@typescript-eslint/no-floating-promises": "error",
      "unused-imports/no-unused-imports": "error",
    },
  },

  // Turn off rules that conflict with Prettier
  prettierConfig,
];
