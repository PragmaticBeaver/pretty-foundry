module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "prettier", "plugin:import/recommended"],
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
  rules: {
    "import/extensions": [2, { js: "never", mjs: "always" }], // disallow js and enforce mjs
  },
  globals: {
    // FoundryVTT Libraries
    $: "readonly",
    Handlebars: "readonly",

    // FoundryVTT props
    ui: "readonly",
    game: "readonly",
    CONFIG: "readonly",

    // FoundryVTT classes
    Hooks: "readonly",
    Application: "readonly",
    Dialog: "readonly",

    // FoundryVTT Namespace utils
    mergeObject: "readonly",

    // FoundryVTT client functions
    loadTemplates: "readonly",
    renderTemplate: "readonly",
  },
};
