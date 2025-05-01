export default {
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.js'],
    transform: {},
    testEnvironment: 'jsdom',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['lcov', 'text'],
    moduleFileExtensions: ['js', 'json'],
  };
  