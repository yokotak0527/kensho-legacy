// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  "preset"           : "ts-jest",
  "verbose"          : true,
  "moduleNameMapper" : { "^@src/(.*)$" : "<rootDir>/src/$1" },
  "testMatch"        : [ "<rootDir>/tests/**/*.ts" ],
  "globals"          : {
    "ts-jest" : {
      "tsconfig" : './tests/tsconfig.json'
    }
  }
};
