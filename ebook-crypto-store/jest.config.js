module.exports = {
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
      '/node_modules/'
    ],
    testMatch: [
      '**/tests/**/*.test.js'
    ],
    setupFiles: ['dotenv/config'],
    testTimeout: 30000,
    forceExit: true,
    detectOpenHandles: true
  };