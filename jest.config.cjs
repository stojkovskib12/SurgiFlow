module.exports = {
  testEnvironment: "jsdom",
  transform: { "^.+\\.[tj]sx?$": "babel-jest" },
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.ts"],
  moduleNameMapper: { "\\.(css|less|scss)$": "<rootDir>/src/test/styleMock.cjs" },
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/dist/"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/test/**",
    "!src/main.tsx",
    "!src/**/*.types.ts",
    "!src/**/sectionTestUtils.tsx",
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "html", "lcov"],
};
