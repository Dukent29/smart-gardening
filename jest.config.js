module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/test/**/*.test.js'],
    setupFilesAfterEnv: ['./jest.setup.js'],
    testTimeout: 10000 // optional: increase timeout to 10s
};