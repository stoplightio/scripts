module.exports = {
  rootDir: process.cwd(),
  testEnvironment: 'node',
  transform: {
    '\\.(ts|tsx)$': 'ts-jest',
  },
  // don't include the __tests__ folders in the templates
  testMatch: ['<rootDir>/src/**/__tests__/*.(ts|js)?(x)'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/', '/__stories__/', '__mocks__/', 'index.ts', 'types.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  globals: {
    'ts-jest': {
      diagnostics: {
        ignoreCodes: [151001],
      },
    },
  },
};
