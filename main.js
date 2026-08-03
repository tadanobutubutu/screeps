// Resolve Jest execution issue with coverage and JSON output
const { execSync } = require('child_process');

// Function to run Jest tests with proper configuration
function runJestWithCoverage() {
    try {
        const result = execSync('jest --coverage --json --outputFile=/tmp/repo-health-muenl/jest.json --coverageReporters=json-summary', {
            encoding: 'utf-8',
            stdio: 'pipe'
        });
        return result;
    } catch (error) {
        return error.stdout || error.message;
    }
}

// Export for use in testing/CI
module.exports = {
    runJestWithCoverage: runJestWithCoverage
};