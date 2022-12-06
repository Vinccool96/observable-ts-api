module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint/eslint-plugin"],
  extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "prefer-const": ["warn", { destructuring: "all" }],
    "spaced-comment": "warn",
    quotes: ["error", "double", { avoidEscape: true, allowTemplateLiterals: false }],
    curly: "error",
  },
}
