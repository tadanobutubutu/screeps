(function() {
    'use strict';

    const { spawn } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    const fastMap = require('fast-map');
    const utils = require('./utils');
    const axe = require('axe-core');
    const accessiblyHelper = require('./accessibly-helper');

    const CONFIG = {
        dataPath: './data',
        maxResults: 100
    };

    const axeConfig = {
        rules: {
            'aria-invalid-2': { enabled: false },
            'color-contrast': { enabled: false },
            'name-role-value': { enabled: false },
            'paraphernalia': { enabled: false },
        },
        silent: true
    };

    let dependencyGraphData = {};

    async function getDependencyGraph() {
        if (Object.keys(dependencyGraphData).length === 0) {
            // Assuming that pages are in './pages' directory with `.js` or `.jsx` extension
            const pagesDir = path.join(__dirname, 'pages');
            const filePaths = await fs.promises.readdir(pagesDir);

            let dependencyGraph = {};
            for (const filePath of filePaths) {
                const fullPath = path.join(pagesDir, filePath);
                const { violations } = await axe.analyze(fullPath);

                if (violations.length > 0) {
                    dependencyGraphData[filePath] = { violations, file };
                }
            }

            dependencyGraphData = fastMap(dependencyGraphData).toObject();
        }

        return dependencyGraphData;
    }

    function spawnProcess(command, args = [], options = {}) {
        return new Promise((resolve, reject) => {
            const defaultOptions = {
                cwd: process.cwd(),
                env: process.env,
                shell: true,
                timeout: 30000
            };

            const spawnOptions = { ...defaultOptions, ...options };
            let stdout = '';
            let stderr = '';
            let timeoutId;

            const child = spawn(command, args, spawnOptions);

            if (spawnOptions.timeout) {
                timeoutId = setTimeout(() => {
                    child.kill('SIGTERM');
                    reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
                }, spawnOptions.timeout);
            }

            child.stdout.on('data', (data) => {
                stdout += data.toString();
            });

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (error) => {
                if (timeoutId) clearTimeout(timeoutId);
                reject(error);
            });

            child.on('close', (exitCode) => {
                if (timeoutId) clearTimeout(timeoutId);
                resolve({ stdout, stderr, exitCode });
            });
        });
    }

    // Address accessibility issues - DOM-based
    function addressAccessibilityIssues() {
        const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
        if (rootContainer) {
            rootContainer.setAttribute('role', 'main');
        }

        // DOM Elements modification taken from the HEAD branch
        const dependencyGraph = document.getElementById('dependencyGraph');

        // Additional modules from HEAD
        const accessiblyHelper = require('./accessibly-helper');

        const appData = {
            title: 'Screeps',
            version: '1.0.0'
        };

        let dependencyGraphData = {};
        let UserSafety = "unsafe";
        let SafetyCategories = "Unauthorized Advice";

        async function scanAccessibility() {
            const filePaths = await fs.promises.readdir(path.join(__dirname, 'pages'));
            const issues = [];

            for (const filePath of filePaths) {
                const fullPath = path.join(__dirname, 'pages', filePath);
                const { violations } = await axe.analyze(fullPath);

                if (violations.length > 0) {
                    issues.push({
                        file: filePath,
                        issues: violations
                    });
                }
            }

            return issues;
        }

        function writeReport(report) {
            const reportFile = path.join(__dirname, 'accessibility_report.json');
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        }

        function generateAccessibilityReport(issuesData) {
            if (issuesData) {
                // Use provided issues data
                const report = {
                    generatedAt: new Date().toISOString(),
                    totalIssuesFound: issuesData.length,
                    issues: issuesData
                };
                writeReport(report);
                return report;
            }

            // Otherwise scan files
            try {
                const issues = await scanAccessibility();
                const report = {
                    generatedAt: new Date().toISOString(),
                    totalFilesScanned: issues.length,
                    totalIssuesFound: issues.reduce((sum, file) => sum + file.issues.length, 0),
                    filesWithIssues: issues.map(file => ({
                        fileName: file.file,
                        issueCount: file.issues.length,
                        issues: file.issues.map(issue => ({
                            id: issue.id,
                            description: issue.description,
                            impact: issue.impact,
                            nodes: issue.nodes.length
                        }))
                    }))
                };

                writeReport(report);
                return report;
            } catch (error) {
                console.error('Error generating accessibility report:', error);
                throw error;
            }
        }

        // Accessibility utilities
        const accessibilityUtils = {
            generateAccessibilityReport,
            addressAccessibilityIssues
        };

        // Export the accessibility report generation function
        module.exports = accessibilityUtils;

        // Address accessibility issues
        addressAccessibilityIssues();
    }

    function initialize() {
        addressAccessibilityIssues();
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
})();