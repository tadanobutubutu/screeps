const { execSync, execFileSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

function getPkgManager() {
    const allowed = ['npm', 'pnpm', 'yarn', 'bun'];
    const envManager = process.env.PKG_MANAGER;
    if (envManager && allowed.includes(envManager)) {
        return envManager;
    }
    return fs.existsSync('pnpm-lock.yaml') ? 'pnpm' : 'npm';
}

function runCommand(file, args) {
    try {
        if (Array.isArray(args)) {
            execFileSync(file, args, { stdio: 'pipe', encoding: 'utf8' });
        } else {
            execSync(file, { stdio: 'pipe', encoding: 'utf8' });
        }
        return { ok: true };
    } catch (error) {
        return {
            ok: false,
            stdout: error.stdout || '',
            stderr: error.stderr || '',
            message: error.message,
        };
    }
}

function readJsonFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return null;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        return null;
    }
}

function checkEslint(report, eslintReportPath) {
    console.log('ESLint を実行中...');
    const eslintResult = runCommand('npx', ['eslint', '.', '--format', 'json', '--output-file', eslintReportPath]);
    const eslintData = readJsonFile(eslintReportPath);

    if (eslintData && Array.isArray(eslintData)) {
        eslintData.forEach((file) => {
            (file.messages || []).forEach((msg) => {
                const relFile = path.relative(process.cwd(), file.filePath);
                report.status = 'unhealthy';
                report.issues.push({
                    type: 'lint',
                    fingerprint: `lint:${relFile}:${msg.line}:${msg.ruleId || 'unknown'}`,
                    severity: msg.severity === 2 ? 'error' : 'warning',
                    file: relFile,
                    line: msg.line,
                    message: msg.message,
                    ruleId: msg.ruleId,
                });
            });
        });
    } else if (!eslintResult.ok) {
        const detail = (eslintResult.stderr || eslintResult.stdout || eslintResult.message).slice(0, 500);
        report.status = 'unhealthy';
        report.issues.push({
            type: 'config_error',
            fingerprint: 'lint:execution-failed',
            severity: 'error',
            message: `ESLint の実行に失敗しました: ${detail}`,
        });
    }

    if (report.issues.filter((i) => i.type === 'lint').length === 0 && eslintResult.ok) {
        console.log('✅ ESLint 合格');
    }
}

function checkJest(report, jestReportPath, pkgManager) {
    console.log('Jest テストとカバレッジを実行中...');
    const jestResult = runCommand(pkgManager, ['run', 'test:coverage', '--', '--json', `--outputFile=${jestReportPath}`, '--coverageReporters=json-summary']);
    const jestData = readJsonFile(jestReportPath);

    if (jestData && Array.isArray(jestData.testResults)) {
        jestData.testResults.forEach((suite) => {
            const relSuite = path.relative(process.cwd(), suite.name);
            (suite.assertionResults || []).forEach((test) => {
                if (test.status === 'failed') {
                    report.status = 'unhealthy';
                    report.issues.push({
                        type: 'test_failure',
                        fingerprint: `test:${relSuite}:${test.title}`,
                        severity: 'error',
                        suite: relSuite,
                        title: test.title,
                        message: (test.failureMessages || []).join('\n'),
                    });
                }
            });
        });
    } else if (!jestResult.ok) {
        const detail = (jestResult.stderr || jestResult.stdout || jestResult.message).slice(0, 500);
        report.status = 'unhealthy';
        report.issues.push({
            type: 'test_failure',
            fingerprint: 'test:execution-failed',
            severity: 'error',
            message: `Jest の実行に失敗しました: ${detail}`,
        });
    }

    if (report.issues.filter((i) => i.type === 'test_failure').length === 0 && jestResult.ok) {
        console.log('✅ Jest テスト合格');
    }
}

function checkCoverage(report, coverageThreshold) {
    const coverageSummaryPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (!fs.existsSync(coverageSummaryPath)) {
        console.log('⚠️ coverage-summary.json が見つかりません（テスト未実行の可能性）');
        return;
    }
    try {
        const summary = JSON.parse(fs.readFileSync(coverageSummaryPath, 'utf8'));
        Object.entries(summary).forEach(([file, data]) => {
            if (file === 'total') return;
            const relPath = path.relative(process.cwd(), file);
            ['lines', 'statements', 'functions', 'branches'].forEach((aspect) => {
                const pct = data[aspect] ? data[aspect].pct : 100;
                if (pct < coverageThreshold) {
                    report.status = 'unhealthy';
                    report.issues.push({
                        type: 'coverage_gap',
                        fingerprint: `coverage:${relPath}:${aspect}`,
                        severity: 'warning',
                        file: relPath,
                        aspect,
                        pct,
                        message: `${relPath} の ${aspect} カバレッジが ${pct}%（目標 ${coverageThreshold}%）`,
                    });
                }
            });
        });
    } catch (error) {
        report.issues.push({
            type: 'coverage_parse_error',
            fingerprint: 'coverage:parse-error',
            severity: 'warning',
            message: `coverage-summary.json の解析に失敗: ${error.message}`,
        });
    }
}

function main() {
    const COVERAGE_THRESHOLD = Number(process.env.COVERAGE_THRESHOLD || '100');
    const PKG_MANAGER = getPkgManager();
    const TMP_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'repo-health-'));
    const ESLINT_REPORT = path.join(TMP_DIR, 'eslint.json');
    const JEST_REPORT = path.join(TMP_DIR, 'jest.json');

    console.log('🔍 リポジトリ健全性チェックを開始...');

    const report = {
        timestamp: new Date().toISOString(),
        status: 'healthy',
        issues: [],
    };

    checkEslint(report, ESLINT_REPORT);
    checkJest(report, JEST_REPORT, PKG_MANAGER);
    checkCoverage(report, COVERAGE_THRESHOLD);

    try {
        fs.writeFileSync('repo-health-report.json', JSON.stringify(report, null, 2));
    } catch (error) {
        console.error('健全性レポートの書き込みに失敗:', error.message);
        process.exit(1);
    }

    try {
        fs.rmSync(TMP_DIR, { recursive: true, force: true });
    } catch {
        // 削除失敗は無視
    }

    console.log(`\n健全性チェック完了: ${report.status}（検出 ${report.issues.length} 件）`);
    process.exit(report.status === 'healthy' ? 0 : 1);
}

if (require.main === module) {
    main();
}

module.exports = {
    getPkgManager,
    runCommand,
    readJsonFile,
    checkEslint,
    checkJest,
    checkCoverage,
    main,
};
