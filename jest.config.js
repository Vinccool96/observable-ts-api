module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts", "json"],
  testMatch: ["**/*.test.ts"],
  transform: { "^.+\\.ts$": "ts-jest" },
  moduleDirectories: [
    "node_modules",
  ],
  globalSetup: "./__tests__/config/globalSetup.ts",
  verbose: true,
}
