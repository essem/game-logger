module.exports = {
  "no-unused-vars": ["error", { args: "all", argsIgnorePattern: "^_" }],
  "no-restricted-syntax": [
    "error",
    "ForInStatement",
    //"ForOfStatement",
    "LabeledStatement",
    "WithStatement",
  ],
};
