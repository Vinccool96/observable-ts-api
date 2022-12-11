import { pathsToModuleNameMapper } from "ts-jest"
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { compilerOptions } from "./tests/tsconfig.jest.json"
import type { JestConfigWithTsJest } from "ts-jest"

const config: JestConfigWithTsJest = {
  // [...]
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths /* , { prefix: '<rootDir>/' } */),
}

export default config
