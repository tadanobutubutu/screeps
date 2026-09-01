const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function getSvgAccessibleName(svgElements) {
  // ... existing implementation
}

function setSvgAttributes(svgElements) {
  // ... existing implementation
}

function renderDependencyGraphs(svgElements) {
  // ... existing implementation
}

const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',

  addressAccessibilityIssues(insightReport) {
    if (!insightReport || !insightReport.sections) {
      return [];
    }

    const issues = [];

    insightReport.sections.forEach((section, index) => {
      // Check for missing headings
      if (!section.heading) {
        issues.push({
          type: 'missing-heading',
          severity: 'high',
          message: `Section ${index} is missing a heading`,
          suggestedFix: 'Add a descriptive heading to each section'
        });
      }

      // Check for empty content
      if (!section.content || section.content.trim() === '') {
        issues.push({
          type: 'empty-content',
          severity: 'medium',
          message: `Section "${section.heading}" has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section "${section.heading}" contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  fixAccessibilityIssues(issues) {
    return issues.map(issue => ({
      ...issue,
      status: 'fixed',
      timestamp: new Date().toISOString()
    }));
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !Array.isArray(accessibilityReport.issues) || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore(fixedIssues) {
    if (!Array.isArray(fixedIssues)) {
      return 0;
    }

    const scorePoints = {
      'color-contrast': 5,
      'missing-alt-text': 3,
      'missing-aria-label': 5,
      'heading-order': 2,
      'other': 1
    };

    return fixedIssues.reduce((score, issue) => {
      const points = scorePoints[issue.type] || scorePoints['other'];
      return score + points;
    }, 0);
  },

  fixMainLandmarkIssues(source) {
    const mainBlockRegex = /<main[^>]*>.*?<\/main>/gs;

    const matches = Array.from(source.matchAll(mainBlockRegex));
    if (matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main([^>]*)>/, '<section$1>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main>/, '<section>')
        .replace(/<\/main>/, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark(element) {
    if (!element) {
      return { valid: false, issue: 'Element is null or undefined' };
    }

    const landmarkRoles = [
      'banner',
      'main',
      'navigation',
      'search',
      'contentinfo',
      'complementary',
      'region',
      'form'
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      'header': 'banner',
      'main': 'main',
      'nav': 'navigation',
      'aside': 'complementary',
      'footer': 'contentinfo',
      'section': 'region',
      'form': 'form'
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return { valid: false, error: 'Element does not have a valid landmark role', element: tagName };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    return childProcess.spawn(command, [], {
      stdio: 'inherit',
      shell: true
    });
  },

  addLangAttribute(element, lang) {
    if (element) {
      element.setAttribute('lang', lang);
    } else {
      const html = document.documentElement;
      if (!html.hasAttribute('lang')) {
        html.setAttribute('lang', 'en');
      }
    }
  },

  countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  renderDependencyGraph() {
    const dependencyContent = require('../dependencyGraphContent/indexContent');
    const graphContainer = document.getElementById('dependency-graph-container');
    if (graphContainer) {
      graphContainer.innerHTML = dependencyContent;
    }
  },

  renderIndexView() {
    const indexContent = require('../indexContent/indexContent');
    const indexContainer = document.getElementById('index-container');
    if (indexContainer) {
      indexContainer.innerHTML = indexContent;
    }
  }
};

let gameData = {
    rooms: {},
    players: {},
    structures: {},
    creepTasks: {}
};

function initializeGameData() {
    gameData.rooms = {
        'W0N0': { terrain: 'normal', sources: 2, controller: true },
        'W0N1': { terrain: 'normal', sources: 1, controller: false }
    };

    gameData.players = {
        'Player1': { username: 'Player1', level: 1, power: 0 },
        'Player2': { username: 'Player2', level: 2, power: 100 }
    };

    gameData.structures = {
        'W0N0': [
            { type: 'spawn', name: 'Spawn1', energy: 300, energyCapacity: 300 },
            { type: 'extension', name: 'Extension1', energy: 50, energyCapacity: 50 }
        ]
    };

    gameData.creepTasks = {
        'harvester1': { task: 'harvest', target: 'source1', status: 'idle' }
    };
}

function scanRoom(roomName) {
    // ... existing implementation
}

function getPlayers() {
    // ... existing implementation
}

function getPlayerInfo(playerName) {
    // ... existing implementation
}

function getStructures(roomName) {
    // ... existing implementation
}

function assignTask(creepName, task, target) {
    // ... existing implementation
}

function getTasks(creepName) {
    // ... existing implementation
}

function init() {
    if (typeof document !== 'undefined') {
        const svgElements = document.querySelectorAll('svg');
    }
}

function initializeAccessibility(svgElements) {
    if (!svgElements) return;
    svgElements.forEach(svg => {
        if (svg && !svg.hasAttribute('role')) {
            svg.setAttribute('role', 'img');
        }

        const accessibleName = getSvgAccessibleName(svg);
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }

        setSvgAttributes(svg);
    });

    if (typeof setupAriaLiveRegions === 'function') setupAriaLiveRegions();
    if (typeof setupFocusManagement === 'function') setupFocusManagement();
    if (typeof enhanceSemanticMarkup === 'function') enhanceSemanticMarkup();
    if (typeof updateDependencyGraphs === 'function') updateDependencyGraphs();
    if (typeof updateIndexViews === 'function') updateIndexViews();
    if (typeof addressAccessibilityIssues === 'function') addressAccessibilityIssues();
}

function main() {
    init();
    if (typeof document !== 'undefined') {
        const svgElements = document.querySelectorAll('svg');
        setSvgAttributes(svgElements);
        svgElements.forEach((svg) => {
            renderDependencyGraphs(svg);
        });
        checkLandmarkElements();
    }
}

function getSvgAccessibleName(svg) {
    if (!svg) return '';
    if (svg.hasAttribute && svg.hasAttribute('aria-label')) {
        return svg.getAttribute('aria-label');
    }
    if (svg.hasAttribute && svg.hasAttribute('aria-labelledby')) {
        const labelledById = svg.getAttribute('aria-labelledby');
        if (typeof document !== 'undefined') {
            const labelElement = document.getElementById(labelledById);
            if (labelElement) {
                return labelElement.textContent.trim();
            }
        }
    }
    if (svg.querySelector) {
        const titleElement = svg.querySelector('title');
        if (titleElement && titleElement.textContent.trim()) {
            return titleElement.textContent.trim();
        }
        const descElement = svg.querySelector('desc');
        if (descElement && descElement.textContent.trim()) {
            return descElement.textContent.trim();
        }
    }
    const id = svg.id;
    if (id) {
        const parts = id.split(/[-_]/);
        return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
    }
    return '';
}

function setSvgAttributes(svg) {
    if (!svg) return;
    if (Array.isArray(svg) || svg.length) {
        // Handle NodeList being passed
        const elements = Array.from(svg);
        elements.forEach((element, index) => {
            if (!element.id) {
                element.id = `svg-element-${index}-${Date.now()}`;
            }
            if (!element.hasAttribute('role')) {
                element.setAttribute('role', 'img');
            }
            if (!element.hasAttribute('width')) {
                element.setAttribute('width', '24');
            }
            if (!element.hasAttribute('height')) {
                element.setAttribute('height', '24');
            }
            if (!element.hasAttribute('focusable')) {
                element.setAttribute('focusable', 'false');
            }
        });
        return;
    }
    if (!svg.hasAttribute('width')) {
        svg.setAttribute('width', '24');
    }
    if (!svg.hasAttribute('height')) {
        svg.setAttribute('height', '24');
    }
    if (!svg.hasAttribute('focusable')) {
        svg.setAttribute('focusable', 'false');
    }
}

function checkLandmarkElements() {
    const checkLandmarkElement = (selector, role) => {
        // ... revised implementation
    };

    // ... revised implementation
}

function checkAccessibilityIssues(code) {
    const issues = [];

    if (!code || typeof code !== 'string') {
        issues.push({ type: 'error', message: 'Code must be a non-empty string' });
        return issues;
    }

    const lines = code.split('\n');
    lines.forEach((line, index) => {
        const lineNum = index + 1;
        if (line.includes('eval(')) {
            issues.push({ type: 'error', line: lineNum, message: 'Use of eval() detected - security risk' });
        }
        if (line.includes('console.log(') && !line.trim().startsWith('//')) {
            issues.push({ type: 'warning', line: lineNum, message: 'Console.log statement found - should be removed in production' });
        }
        if (line.includes('debugger;')) {
            issues.push({ type: 'warning', line: lineNum, message: 'Debugger statement found' });
        }
        if (line.includes('// TODO') || line.includes('// FIXME')) {
            issues.push({ type: 'info', line: lineNum, message: 'Comment found - should be addressed' });
        }
    });

    if (code.length > 10000) {
        issues.push({ type: 'warning', message: 'Code length exceeds 10000 characters - consider splitting' });
    }

    return issues;
}

function generateAccessibilityReport(scan) {
    const issues = checkAccessibilityIssues(scan);

    const summary = {
        total: issues.length,
        errors: issues.filter(i => i.type === 'error').length,
        warnings: issues.filter(i => i.type === 'warning').length,
        info: issues.filter(i => i.type === 'info').length
    };

    return {
        summary,
        issues,
        generatedAt: new Date().toISOString()
    };
}

function getGameDataSummary() {
    return {
        rooms: Object.keys(gameData.rooms).length,
        players: Object.keys(gameData.players).length,
        structures: Object.values(gameData.structures).reduce((total, roomStructures) => total + roomStructures.length, 0),
        tasks: Object.keys(gameData.creepTasks).length
    };
}

function ensureDependencyGraphARIA() {
    return true;
}

function getLangAttribute() {