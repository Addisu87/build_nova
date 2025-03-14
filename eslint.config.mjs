const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "no-unused-vars": "error",
      "@typescript-eslint/no-unused-vars": ["error", {
        "vars": "all",
        "args": "after-used",
        "ignoreRestSiblings": false
      }],
      "import/no-unused-modules": [1, {
        "unusedExports": true
      }]
    }
  }
];

export default eslintConfig;
