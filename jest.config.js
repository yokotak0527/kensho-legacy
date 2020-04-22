// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "preset": "ts-jest",
  "verbose": true,
  "moduleNameMapper": {
    "^@src/(.*)$": "<rootDir>/src/$1",
    "^@types/(.*)$": "<rootDir>/types/$1"
  },
  "testMatch": [
    "<rootDir>/test/**/*.ts"
  ]
};
