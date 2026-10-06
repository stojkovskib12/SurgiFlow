module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.[tj]sx?$": "babel-jest" },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: { "\\.(css|less|scss)$": "<rootDir>/src/test/styleMock.cjs" },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
};
