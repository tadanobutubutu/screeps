(function() {
    'use strict';

    const express = require('express');
    const axe = require('axe-core');
    const fs = require('fs');
    const path = require('path');
    const fastMap = require('fast-map');

    const LANDMARK_CONFIG = {
        dataPath: './data',
        maxResults: 100
    };

    const CONFIG = {
        apiUrl: process.env.API_URL || 'https://api.example.com',
        timeout: 5000
    };

    function getLangAttribute() {
        return navigator.language || navigator.userLanguage;
    }

    const app = express();

    require('./utils')(app, { axe, fs, path, fastMap, CONFIG });

    app.get('/', (req, res) => {
        res.json({ message: 'Welcome to the Screeps bot accessibility report generator' });
    });

    app.get('/report', generateAccessibilityReport);

    app.listen(3000, () => {
        console.log('Accessibility report server listening on port 3000');
    });

    function generateAccessibilityReport() {
        const report = scanAccessibility();
        writeReport(report);
        return report;
    }

    async function scanAccessibility() {
        const filePaths = await fs.promises.readdir(path.join(__dirname, 'pages'));
        const issues = [];

        for (const filePath of filePaths) {
            const fullPath = path.join(__dirname, 'pages', filePath);
            try {
                const { violations } = await axe.analyze(fullPath);

                if (violations.length > 0) {
                    issues.push({
                        file: filePath,
                        issues: violations,
                    });
                }
            } catch (e) {
                console.error(`Error analyzing ${fullPath}:`, e);
            }
        }

        return issues;
    }

    function writeReport(report) {
        const reportFile = path.join(__dirname, 'accessibility_report.json');
        fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
    }
})();