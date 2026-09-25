(function() {
    'use strict';

    // DOM Elements
    const dependencyGraph = document.getElementById('dependencyGraph');

    // Import required modules
    const { spawn } = require('child_process');
    const path = require('path');
    const fs = require('fs');
    const fastMap = require('fast-map');
    const utils = require('./utils');
    const accessiblyHelper = require('./accessibly-helper');
    const existingNonConflictingModule = require('./existing_non_conflicting_module');

    // Try to import axe-core and accessibility utilities (may not be available in all environments)
    let axe = null;
    let a11y = null;
    try {
        axe = require('axe-core');
    } catch (e) {
        // axe-core not available; skip runtime analysis
    }
    try {
        a11y = require('./AccessibilityUtilities');
    } catch (e) {
        // AccessibilityUtilities not available
    }

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

    const pagesDir = path.join(__dirname, 'pages');
    let dependencyGraphData = {};

    async function getDependencyGraph() {
        if (Object.keys(dependencyGraphData).length === 0) {
            const filePaths = await fs.promises.readdir(pagesDir);

            let dependencyGraph = {};
            for (const filePath of filePaths) {
                const fullPath = path.join(pagesDir, filePath);
                const { violations } = await axe.analyze(fullPath);

                if (violations.length > 0) {
                    dependencyGraphData[filePath] = { violations, file: filePath };
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

    function getLangAttribute() {
        if (typeof document !== 'undefined') {
            return document.documentElement ? (document.documentElement.getAttribute('lang') || '') : '';
        }
        return '';
    }

    function addLangAttribute() {
        if (typeof document !== 'undefined' && document.documentElement) {
            if (!document.documentElement.hasAttribute('lang')) {
                document.documentElement.setAttribute('lang', 'en');
            }
        }
    }

    function validateTableAccessibility(table) {
        if (!table || !(table instanceof HTMLElement)) {
            return false;
        }
        const hasCaption = table.querySelector('caption') !== null;
        const hasHeaders = Array.from(table.querySelectorAll('th')).some(th => th.hasAttribute('scope'));
        const hasStructure = validateTableStructure(table);
        return hasCaption || hasHeaders || hasStructure;
    }

    function validateTableStructure(table) {
        if (!table || !(table instanceof HTMLElement)) {
            return false;
        }
        const rows = table.querySelectorAll('tr');
        if (rows.length === 0) {
            return false;
        }
        const firstRowCellCount = rows[0].querySelectorAll('td, th').length;
        for (let i = 1; i < rows.length; i++) {
            const rowCells = rows[i].querySelectorAll('td, th');
            if (rowCells.length !== firstRowCellCount) {
                return false;
            }
        }
        return true;
    }

    function fixTableStructure(table) {
        if (!table || !(table instanceof HTMLElement)) {
            return;
        }
        const caption = table.querySelector('caption');
        if (!caption) {
            const newCaption = document.createElement('caption');
            newCaption.textContent = 'Data Table';
            table.insertBefore(newCaption, table.firstChild);
        }
        const headers = table.querySelectorAll('th');
        headers.forEach(th => {
            if (!th.hasAttribute('scope')) {
                th.setAttribute('scope', 'col');
            }
        });
    }

    function fixAllTables() {
        if (typeof document === 'undefined') return;
        const tables = document.querySelectorAll('table');
        tables.forEach(fixTableStructure);
    }

    function addMainLandmark() {
        if (typeof document === 'undefined') return;
        const existingMain = document.querySelector('main');
        if (!existingMain && document.body) {
            const mainElement = document.createElement('main');
            const firstChild = document.body.firstChild;
            if (firstChild) {
                document.body.insertBefore(mainElement, firstChild);
            } else {
                document.body.appendChild(mainElement);
            }
        }
    }

    async function scanAccessibility() {
        const issues = [];

        if (!axe || typeof fs === 'undefined') {
            return issues;
        }

        let filePaths = [];
        try {
            filePaths = await fs.promises.readdir(pagesDir);
        } catch (e) {
            // pages directory not available
            return issues;
        }

        for (const filePath of filePaths) {
            const fileEmitted = path.join(pagesDir, filePath);
            try {
                const { violations } = await axe.analyze(fileEmitted);
                if (violations && violations.length > 0) {
                    issues.push({
                        file: filePath,
                        issues: violations,
                    });
                }
            } catch (e) {
                // skip files that fail analysis
            }
        }

        return issues;
    }

    function writeReport(report) {
        const reportFile = path.join(__dirname, 'accessibility_report.json');
        try {
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        } catch (e) {
            // unable to write report
        }
    }

    function generateAccessibilityReport(issuesData) {
        if (issuesData) {
            const report = {
                generatedAt: new Date().toISOString(),
                totalIssuesFound: issuesData.length,
                issues: issuesData
            };
            writeReport(report);
            return report;
        }

        try {
            const issues = scanAccessibility();
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

    function addressAccessibilityIssues() {
        const rootContainer = document.getElementById('root') ? document.getElementById('root').parentElement : null;
        if (rootContainer) {
            rootContainer.setAttribute('role', 'main');
        }
    }

    function validateLandmarkRequired() {
        const requiredLandmarks = ['main', 'nav', 'footer'];
        const missingLandmarks = [];

        requiredLandmarks.forEach(landmark => {
            const element = document.querySelector(`[role="${landmark}"]`) ||
                           document.querySelector(landmark);
            if (!element) {
                missingLandmarks.push(landmark);
            }
        });

        if (missingLandmarks.length > 0) {
            console.warn('Missing required landmarks:', missingLandmarks.join(', '));
            return false;
        }
        return true;
    }

    const accessibilityUtils = {
        generateAccessibilityReport,
        addressAccessibilityIssues,
        validateLandmark: validateLandmarkRequired
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = accessibilityUtils;
    }

    function initialize() {
        existingNonConflictingModule.initialize();

        addLangAttribute();

        addressAccessibilityIssues();

        addMainLandmark();
        fixAllTables();

        if (dependencyGraph) {
            dependencyGraph.setAttribute('role', 'region');
            dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
        }

        if (a11y && typeof a11y.init === 'function') {
            a11y.init();
        }

        if (axe) {
            scanAccessibility().then(issues => {
                if (issues.length > 0) {
                    console.error('Accessibility issues found:', JSON.stringify(issues, null, 2));
                    writeReport(issues);
                }
            }).catch(err => {
                console.error('Accessibility scan failed:', err);
            });
        }
    }

    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }

    if (typeof window !== 'undefined') {
        window.validateLandmark = validateLandmarkRequired;
    }
})();