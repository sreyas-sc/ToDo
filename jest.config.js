module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
      '^@/components/(.*)$': '<rootDir>/components/$1',
      '^@/pages/(.*)$': '<rootDir>/pages/$1',
      // Add any other path aliases you use
    },
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    testMatch: [
      '**/__tests__/**/*.+(ts|tsx|js)',
      '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  };