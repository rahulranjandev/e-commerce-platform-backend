import { readFileSync } from 'fs';
import { parseConfigFileTextToJson } from 'typescript';
import { pathsToModuleNameMapper } from 'ts-jest';
import type { JestConfigWithTsJest } from 'ts-jest';

// Parse tsconfig with comments preserved
const tsconfigText = readFileSync('./tsconfig.json', 'utf-8');
const { config: tsconfig } = parseConfigFileTextToJson('./tsconfig.json', tsconfigText);
const compilerOptions = tsconfig?.compilerOptions ?? {};

const config: JestConfigWithTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}, { prefix: '<rootDir>/src/' }),
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  clearMocks: true,
  restoreMocks: true,
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151002],
      },
    },
  },
};

export default config;
