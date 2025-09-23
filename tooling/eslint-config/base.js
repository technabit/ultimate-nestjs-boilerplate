import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import turboPlugin from "eslint-plugin-turbo";
import tseslint from "typescript-eslint";
// removed only-warn to preserve rule severities (e.g., keep errors as errors)

/**
 * A shared ESLint configuration for the repository.
 *
 * @type {import("eslint").Linter.Config[]}
 * */
export const config = [
  js.configs.recommended,
  eslintConfigPrettier,
  prettierRecommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      turbo: turboPlugin,
    },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
    },
  },
  {
    // sync with root eslint.config.mjs ignores (support nested workspaces)
    ignores: ["**/dist/**", "**/src/generated/**", "**/eslint.config.*"],
  },
  // sync with root eslint.config.mjs rules
  {
    rules: {
      "no-console": "error",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
];
