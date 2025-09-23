/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  "singleQuote": true,
  "trailingComma": "all",
  "plugins": ["prettier-plugin-organize-imports"],
  "organizeImportsSkipDestructiveCodeActions": true
};

export default config;
