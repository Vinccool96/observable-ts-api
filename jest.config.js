module.exports = {
  clearMocks: true,
  moduleFileExtensions: ["js", "ts", "json"],
  testMatch: ["**/*.test.ts"],
  transform: { "^.+\\.ts$": "ts-jest" },
  moduleDirectories: ["node_modules"],
  globalSetup: "./tests/config/globalSetup.ts",
  verbose: true,
}
