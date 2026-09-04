// Main JavaScript file
// This file handles the main application logic and integrates accessibility utilities

(function() {
    'use strict';

    // DOM Elements
    const dependencyGraph = document.getElementById('dependencyGraph');

    // Import required modules
    const fs = require('fs');
    const path = require('path');

    // Assuming that pages are in './pages' directory with `.js` or `.jsx` extension
    const pagesDir = path.join(__dirname, 'pages');

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

    // Accessibility utility functions

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

    // Function to scan pages for accessibility issues and generate a report
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

    // Function to write the generated report to a file
    function writeReport(report) {
        const reportFile = path.join(__dirname, 'accessibility_report.json');
        try {
            fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
        } catch (e) {
            // unable to write report
        }
    }

    // Initialize accessibility improvements
    function initialize() {
        if (typeof document === 'undefined') return;

        // Ensure document has a language attribute
        addLangAttribute();

        // Ensure the dependencyGraph container has a proper ARIA role
        if (dependencyGraph) {
            dependencyGraph.setAttribute('role', 'region');
            dependencyGraph.setAttribute('aria-label', 'Dependency graph visualization');
        }

        // Add a main landmark if missing
        addMainLandmark();

        // Fix accessibility issues on existing tables
        fixAllTables();

        // Enhance existing functions from a11y utilities (if any)
        if (a11y && typeof a11y.init === 'function') {
            a11y.init();
        }

        // Initialize scanning for accessibility issues (from both sides of the conflict)
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

    // Initialize on DOM ready
    if (typeof document !== 'undefined') {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    }
})();