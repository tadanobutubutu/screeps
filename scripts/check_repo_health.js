const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running Repository Health and Security Check...');

let report = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    issues: []
};

// 1. ESLint Static Analysis Check
try {
    console.log('Running ESLint...');
    execSync('npm run lint -- --format=json', { stdio: 'pipe' });
    console.log('✅ ESLint passed.');
} catch (error) {
    report.status = 'unhealthy';
    try {
        const eslintOutput = error.stdout.toString().trim();
        const jsonStart = eslintOutput.indexOf('[');
        if (jsonStart !== -1) {
            const results = JSON.parse(eslintOutput.substring(jsonStart));
            results.forEach(file => {
                if (file.messages.length > 0) {
                    file.messages.forEach(msg => {
                        report.issues.push({
                            type: 'lint',
                            severity: msg.severity === 2 ? 'error' : 'warning',
                            file: path.relative(process.cwd(), file.filePath),
                            line: msg.line,
                            message: msg.message,
                            ruleId: msg.ruleId
                        });
                    });
                }
            });
        } else {
            report.issues.push({
                type: 'lint',
                severity: 'error',
                message: 'ESLint execution failed with output: ' + eslintOutput.substring(0, 500)
            });
        }
    } catch (e) {
        report.issues.push({
            type: 'lint',
            severity: 'error',
            message: 'ESLint failed and output could not be parsed: ' + error.message
        });
    }
}

// 2. Jest Test Suite & Coverage Check
try {
    console.log('Running Jest Tests and Coverage...');
    execSync('npx jest --coverage --coverageReporters=json-summary --json', { stdio: 'pipe' });
    console.log('✅ Jest Tests passed.');
} catch (error) {
    report.status = 'unhealthy';
    try {
        const jestOutput = error.stdout.toString().trim();
        const jsonStart = jestOutput.indexOf('{');
        if (jsonStart !== -1) {
            const results = JSON.parse(jestOutput.substring(jsonStart));
            if (results.testResults) {
                results.testResults.forEach(suite => {
                    suite.assertionResults.forEach(test => {
                        if (test.status === 'failed') {
                            report.issues.push({
                                type: 'test_failure',
                                severity: 'error',
                                suite: path.relative(process.cwd(), suite.name),
                                title: test.title,
                                message: test.failureMessages.join('\n')
                            });
                        }
                    });
                });
            }
        } else {
            report.issues.push({
                type: 'test_failure',
                severity: 'error',
                message: 'Jest tests execution failed with output: ' + jestOutput.substring(0, 500)
            });
        }
    } catch (e) {
        report.issues.push({
            type: 'test_failure',
            severity: 'error',
            message: 'Jest tests failed: ' + error.message
        });
    }
}

// 3. Parse Coverage Summary for Code Coverage Issues (Aiming for 100%)
const coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
if (fs.existsSync(coverageSummaryPath)) {
    try {
        const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
        Object.entries(summary).forEach(([file, data]) => {
            const relPath = path.relative(process.cwd(), file);
            if (relPath === 'total') return; // Skip total

            // Check if any coverage aspect is below 100%
            const aspects = ['lines', 'statements', 'functions', 'branches'];
            aspects.forEach(aspect => {
                const pct = data[aspect] ? data[aspect].pct : 100;
                if (pct < 100) {
                    report.status = 'unhealthy';
                    report.issues.push({
                        type: 'coverage_gap',
                        severity: 'warning',
                        file: relPath,
                        aspect: aspect,
                        pct: pct,
                        message: `Coverage for ${aspect} in ${relPath} is ${pct}% (below target 100%)`
                    });
                }
            });
        });
    } catch (e) {
         report.issues.push({
             type: 'coverage_parse_error',
             severity: 'warning',
             message: 'Failed to parse coverage-summary.json: ' + e.message
         });
    }
} else {
    console.log('⚠️ coverage-summary.json not found. Run tests with coverage first.');
}

// Save health report
fs.writeFileSync('repo-health-report.json', JSON.stringify(report, null, 2));

console.log(`\nHealth check finished. Status: ${report.status}. Found ${report.issues.length} issues.`);

// Exit with code 1 if unhealthy so workflow detects it
if (report.status === 'unhealthy') {
    process.exit(1);
} else {
    process.exit(0);
}
