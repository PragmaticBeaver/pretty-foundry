module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier"],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [".eslintrc.{js,cjs}"],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  rules: {},
  globals: {
    // FoundryVTT Libraries
    $: "readonly",

    // FoundryVTT props
    ui: "readonly",
    game: "readonly",
    CONFIG: "readonly",

    // FoundryVTT classes
    Hooks: "readonly",
    Application: "readonly",

    // FoundryVTT Namespace utils
    mergeObject: "readonly",

    // FoundryVTT client functions
    loadTemplates: "readonly",
    renderTemplate: "readonly",
  },
};
