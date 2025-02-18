module.exports = {
    testTimeout: 15000, // Increase timeout to 15s
      preset: 'ts-jest',
      testEnvironment: 'node',
      testMatch: ['**/tests/**/*.test.ts'], // Only test files inside `tests/` folder
      forceExit: true,
      clearMocks: true,
    };