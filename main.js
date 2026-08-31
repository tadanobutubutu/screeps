const express = require('express');
const axe = require('axe-core');
const fs = require('fs');
const fastMap = require('fast-map');
const path = require('path');

// Configuration
const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// Helper function to validate landmark structure
function isValidLandmark(landmark) {
    return landmark &&
           typeof landmark.id !== 'undefined' &&
           landmark.id !== null;
}

// Load landmarks from file
function loadLandmarks() {
    try {
        const filePath = path.join(__dirname, CONFIG.dataPath, 'landmarks.json');
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error loading landmarks:', error.message);
        return [];
    }
}

// Function to get the language attribute value
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
    const baseFunction = (text, handler) => {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = handler;
        return button;
    };

    return baseFunction(buttonText, onClickHandler);
}

// Function to scan pages for accessibility issues and generate a report
async function scanAccessibility(pagesDir) {
    const filePaths = await fs.promises.readdir(pagesDir);
    const issues = [];

    for (const filePath of filePaths) {
        const fileEmitted = path.join(pagesDir, filePath);
        const { violations } = await axe.analyze(fileEmitted);

        if (violations.length > 0) {
            issues.push({
                file: filePath,
                issues: violations,
            });
        }
}

// Function to address accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport(insightReport) {
    if (!insightReport || !insightReport.issues) {
        return;
    }

    insightReport.issues.forEach(function(issue) {
        switch (issue.type) {
            case 'REACT_015':
                if (issue.element) {
                    addLangAttribute(issue.element);
                }
                break;
            case 'REACT_027':
                if (issue.type === 'structure') {
                    validateTableStructure();
                    fixTableStructure();
                } else {
                    validateTableAccessibility();
                }
                break;
            case 'REACT_017':
                addMainLandmark();
                validateLandmark();
                validateLandmarkStructure();
                addLandmarkRegions();
                break;
            case 'REACT_041':
                // Handle SVG accessible names
                getSvgAccessibleName();
                setSvgAttributes();
                break;
            case 'REACT_025':
                ensureUniqueLandmarks();
                break;
            case 'REACT_036':
                // Handle fake links
                createInPageButton('Fake Link Handler', () => {});
                break;
        }
    });
}

// Function to generate an accessibility report
function generateAccessibilityReport(pagesDir, language) {
    const options = {
        rules: [{ id: 'color-contrast' }, { id: 'aria-roles' }]
    };

    const report = axe.auditWebpage(document.body, options);
    writeReport(report);
    return report;
}

// Function to get the language attribute value
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

// Function to add lang attribute to HTML element
function addLangAttribute(element) {
    if (element && typeof element === 'object') {
        element.lang = getLangAttribute();
    }
    return element;
}

// Function to validate table accessibility
function validateTableAccessibility() {
    // Implementation of validateTableAccessibility function
    // ...
}

// Function to validate table structure
function validateTableStructure() {
    // Implementation of validateTableStructure function
    // ...
}

// Function to fix table structure issues
function fixTableStructure() {
    // Implementation of fixTableStructure function
    // ...
}

// Function to add main landmark
function addMainLandmark() {
    // Implementation of addMainLandmark function
    // ...
}

// Function to validate landmark
function validateLandmark() {
    const issues = [];
    const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'];
    
    if (typeof document !== 'undefined') {
        const landmarks = document.querySelectorAll('[role]');
        
        landmarks.forEach((element) => {
            const role = element.getAttribute('role');
            
            if (!landmarkRoles.includes(role)) {
                issues.push({
                    description: `Invalid or non-standard landmark role: ${role}`,
                    severity: 'low',
                    element: element.tagName.toLowerCase(),
                    landmark: role
                });
            }
            
            const tagName = element.tagName.toLowerCase();
            if (role === 'main' && tagName !== 'main') {
                issues.push({
                    description: 'Main landmark should use <main> element',
                    severity: 'medium',
                    element: tagName,
                    landmark: 'main'
                });
            }
        });
        
        const mainElements = document.querySelectorAll('main, [role="main"]');
        if (mainElements.length > 1) {
            issues.push({
                description: 'Multiple main landmarks found - only one main landmark is allowed',
                severity: 'high',
                element: 'main',
                landmark: 'main'
            });
        }
        
        const bannerElements = document.querySelectorAll('header, [role="banner"]');
        if (bannerElements.length > 1) {
            issues.push({
                description: 'Multiple banner landmarks found',
                severity: 'medium',
                element: 'header',
                landmark: 'banner'
            });
        }
        
        const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
        if (footerElements.length > 1) {
            issues.push({
                description: 'Multiple contentinfo landmarks found',
                severity: 'medium',
                element: 'footer',
                landmark: 'contentinfo'
            });
        }
        
        landmarks.forEach((element) => {
            const role = element.getAttribute('role');
            const needsLabel = ['navigation', 'search', 'form', 'region'];
            
            if (needsLabel.includes(role)) {
                const hasLabel = element.getAttribute('aria-label') || 
                                element.getAttribute('aria-labelledby') ||
                                element.id;
                
                if (!hasLabel) {
                    issues.push({
                        description: `Landmark role "${role}" is missing accessible name (aria-label, aria-labelledby, or id)`,
                        severity: 'medium',
                        element: element.tagName.toLowerCase(),
                        landmark: role
                    });
                }
            }
        });
    }
    
    return issues;
}

// Function to validate landmark structure
function validateLandmarkStructure() {
    console.log('Validating landmark structure');
}

// Function to get SVG accessible name
function getSvgAccessibleName() {
    return 'Accessible SVG Icon';
}

// Function to set SVG attributes
function setSvgAttributes(svg, accessibleName) {
    if (svg && typeof svg === 'object') {
        svg.setAttribute('role', 'img');
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
    return svg;
}

// Route handlers
app.get('/accessibility-report', async (req, res) => {
    const report = await generateAccessibilityReport();
    res.json(report);
});

app.get('/landmarks', async (req, res) => {
    const landmarks = loadLandmarks();
    const processed = processLandmarks(landmarks);
    const sorted = sortLandmarks(processed);

    if (sorted.length > 0) {
        addLangAttribute();
        validateTableAccessibility();
        validateTableStructure();
        fixTableStructure();
        addMainLandmark();
        validateLandmark();
        validateLandmarkStructure();
        getSvgAccessibleName();
        setSvgAttributes();
        handleFakeLinks();
    }

    res.json(sorted);
});

// Middleware to wrap primary content in main element
app.use('/', (req, res, next) => {
    const parent = req.locals.main || req.locals.content;
    if (parent && parent.nodeType !== 'number') {
        const mainElement = document.createElement('main');
        mainElement.appendChild(parent);
        return mainElement;
    }
    next();
});

// Initialize on DOM ready
function initialize() {
    if (dependencyGraph) {
        if (!dependencyGraph.id) {
            dependencyGraph.id = 'dependencyGraph';
        }
        if (!dependencyGraph.hasAttribute('role')) {
            dependencyGraph.setAttribute('role', 'img');
        }
        if (!dependencyGraph.hasAttribute('aria-label')) {
            dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
        }
    }
}

// Export the main module
module.exports = {
    addLangAttribute,
    validateTableAccessibility,
    validateTableStructure,
    fixTableStructure,
    addMainLandmark,
    validateLandmark,
    validateLandmarkStructure,
    getSvgAccessibleName,
    setSvgAttributes,
    ensureUniqueLandmarks,
    createInPageButton,
    validateInput,
    processData,
    formatResponse,
    config: CONFIG,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    landmarkConfig: CONFIG,
    generateAccessibilityReport,
    addressAccessibilityIssuesFromInsightReport,
    getLangAttribute,
    scanAccessibility,
    writeReport,
    handleFakeLinks
};

// Initialize app
const app = express();

// Configure app state
const appState = {
    initialized: false,
    data: null,
    cache: new Map()
};

// Initialize function
function initializeApp() {
    initialize();
    appState.initialized = true;
    console.log('App initialized');
    return appState;
}

// Initialize app
initializeApp();

// Process data function
function processData(data) {
    if (!data) {
        return null;
    }
    appState.data = data;
    return data;
}

// Fetch user function
function fetchUser(userId) {
    if (!userId) {
        return null;
    }
    return { id: userId, name: 'User ' + userId };
}

// Clear cache function
function clearCache() {
    appState.cache.clear();
}

// Helper function
function someFunction() {
    return 'some value';
}

// Helper for input transformation
function helper(input) {
    return input ? input.toUpperCase() : '';
}

// Format date function
function formatDate(date) {
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    return date.toISOString();
}

// Validate input function
function validateInput(input) {
    if (!input) {
        return false;
    }
    return true;
}

// Language attribute functions
function getLangAttribute() {
    return document.documentElement.lang || 'en';
}

function addLangAttribute(element) {
    if (element && typeof element === 'object') {
        element.lang = getLangAttribute();
    }
    return element;
}

// Table accessibility functions
function validateTableAccessibility() {
    // Implementation of validateTableAccessibility function
    // ...
}

function validateTableStructure() {
    // Implementation of validateTableStructure function
    // ...
}

// Function to add main landmark
function addMainLandmark() {
    // Implementation of addMainLandmark function
    // ...
}

// Toggle validation functions
function validateLandmark() {
    const issues = [];
    const landmarkRoles = ['main', 'navigation', 'banner', 'contentinfo', 'complementary', 'search', 'form', 'region'];
    
    if (typeof document !== 'undefined') {
        const landmarks = document.querySelectorAll('[role]');
        
        landmarks.forEach((element) => {
            const role = element.getAttribute('role');
            
            if (!landmarkRoles.includes(role)) {
                issues.push({
                    description: `Invalid or non-standard landmark role: ${role}`,
                    severity: 'low',
                    element: element.tagName.toLowerCase(),
                    landmark: role
                });
            }
            
            const tagName = element.tagName.toLowerCase();
            if (role === 'main' && tagName !== 'main') {
                issues.push({
                    description: 'Main landmark should use <main> element',
                    severity: 'medium',
                    element: tagName,
                    landmark: 'main'
                });
            }
        });
        
        const mainElements = document.querySelectorAll('main, [role="main"]');
        if (mainElements.length > 1) {
            issues.push({
                description: 'Multiple main landmarks found - only one main landmark is allowed',
                severity: 'high',
                element: 'main',
                landmark: 'main'
            });
        }
        
        const bannerElements = document.querySelectorAll('header, [role="banner"]');
        if (bannerElements.length > 1) {
            issues.push({
                description: 'Multiple banner landmarks found',
                severity: 'medium',
                element: 'header',
                landmark: 'banner'
            });
        }
        
        const footerElements = document.querySelectorAll('footer, [role="contentinfo"]');
        if (footerElements.length > 1) {
            issues.push({
                description: 'Multiple contentinfo landmarks found',
                severity: 'medium',
                element: 'footer',
                landmark: 'contentinfo'
            });
        }
        
        landmarks.forEach((element) => {
            const role = element.getAttribute('role');
            const needsLabel = ['navigation', 'search', 'form', 'region'];
            
            if (needsLabel.includes(role)) {
                const hasLabel = element.getAttribute('aria-label') || 
                                element.getAttribute('aria-labelledby') ||
                                element.id;
                
                if (!hasLabel) {
                    issues.push({
                        description: `Landmark role "${role}" is missing accessible name (aria-label, aria-labelledby, or id)`,
                        severity: 'medium',
                        element: element.tagName.toLowerCase(),
                        landmark: role
                    });
                }
            }
        });
    }
    
    return issues;
}

// SVG accessibility functions
function getSvgAccessibleName() {
    return 'Accessible SVG Icon';
}

function setSvgAttributes(svg, accessibleName) {
    if (svg && typeof svg === 'object') {
        svg.setAttribute('role', 'img');
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
    return svg;
}

// Harvest logic implementation
async function harvest(pagesDir) {
    try {
        const report = await scanAccessibility(pagesDir);
        const harvestedData = {
            timestamp: new Date().toISOString(),
            pagesScanned: report.length,
            totalIssues: report.reduce((acc, curr) => acc + curr.issues.length, 0),
            details: report
        };

        const harvestFile = path.join(__dirname, 'harvest_data.json');
        fs.writeFileSync(harvestFile, JSON.stringify(harvestedData, null, 2));

        return harvestedData;
    } catch (error) {
        console.error('Harvest failed:', error);
        throw error;
    }
}

// Upgrade logic implementation
async function upgrade(harvestedData) {
    try {
        const data = harvestedData || (() => {
            const harvestFile = path.join(__dirname, 'harvest_data.json');
            if (fs.existsSync(harvestFile)) {
                return JSON.parse(fs.readFileSync(harvestFile, 'utf8'));
            }
            return null;
        })();

        if (!data) {
            throw new Error('No harvested data available for upgrade');
        }

        const upgradePlan = {
            timestamp: new Date().toISOString(),
            basedOnHarvest: data.timestamp,
            improvements: [],
            applied: false
        };

        if (data.details && data.details.length > 0) {
            data.details.forEach(page => {
                page.issues.forEach(violation => {
                    upgradePlan.improvements.push({
                        file: page.file,
                        rule: violation.id,
                        impact: violation.impact,
                        description: violation.description,
                        recommendation: `Fix ${violation.id} issue in ${page.file}`
                    });
                });
            });
        }

        upgradePlan.applied = true;
        upgradePlan.appliedAt = new Date().toISOString();

        const upgradeFile = path.join(__dirname, 'upgrade_plan.json');
        fs.writeFileSync(upgradeFile, JSON.stringify(upgradePlan, null, 2));

        return upgradePlan;
    } catch (error) {
        console.error('Upgrade failed:', error);
        throw error;
    }
}

// Combined harvest and upgrade workflow
async function harvestAndUpgrade(pagesDir) {
    const harvested = await harvest(pagesDir);
    const upgraded = await upgrade(harvested);
    return { harvested, upgraded };
}

// Export the report generation function
module.exports = {
    validateInput,
    processData,
    formatResponse,
    config,
    isValidLandmark,
    loadLandmarks,
    processLandmarks,
    sortLandmarks,
    getLandmarkById,
    ensureUniqueLandmarks,
    landmarkConfig: CONFIG,
    generateAccessibilityReport: async function (pagesDir, language) {
        const report = await scanAccessibility(pagesDir, language);
        writeReport(report);
    },
    addressAccessibilityIssuesFromInsightReport,
    getLangAttribute,
    createInPageButton,
    a11y,
    harvest,
    upgrade,
    harvestAndUpgrade,
    checkLinkAccessibility,
    writeReport,
    scanAccessibility,
    ensureUniqueLandmarks,
    createInPageButton: createInPageButton,
    validateInput,
    processData,
    formatResponse
};

// Initialize on DOM ready
function initialize() {
    if (dependencyGraph) {
        if (!dependencyGraph.id) {
            dependencyGraph.id = 'dependencyGraph';
        }
        if (!dependencyGraph.hasAttribute('role')) {
            dependencyGraph.setAttribute('role', 'img');
        }
        if (!dependencyGraph.hasAttribute('aria-label')) {
            dependencyGraph.setAttribute('aria-label', 'Dependency Graph Visualization');
        }
    }
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
}