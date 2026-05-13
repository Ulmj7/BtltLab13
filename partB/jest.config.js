// Jest нь ES modules дээр experimental-vm-modules flag-аар ажиллана.
// `package.json` дотор `"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"`
// гэж тохируулсан байх ёстой.

export default {
  testEnvironment: 'node',
  // ESM ашиглах тул transform хэрэггүй.
  transform: {},
  testMatch: ['<rootDir>/tests/**/*.test.js'],
  collectCoverageFrom: ['src/**/*.js', '!src/server.js'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  clearMocks: true,
};
