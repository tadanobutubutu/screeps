const AddressabilityIssues = {
  ensureElementId(element, prefix = 'el') {
    if (!element) return '';
    if (!element.id) {
      const generatedId = `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
      element.id = generatedId;
    }
    return element.id;
  },
  addAriaLabel(element, label) {
    if (!element) return;
    if (label && !element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  },
  renderDependencyGraph(graphData, container) {
    if (!container) return;
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Dependency graph');
    container.appendChild(svg);
  },
  // Addressability-related functionality
  // Placeholder for addressability issues tracking
  issues: [],
  add: function(issue) {
    this.issues.push(issue);
  },
  clear: function() {
    this.issues = [];
  },

  analyzeAccessibilityIssues: function(insightReport) {
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
          message: `Section ${index} has no content`,
          suggestedFix: 'Add meaningful content to the section'
        });
      }

      // Check for potentially inaccessible language
      if (section.content && section.content.toLowerCase().includes('click here')) {
        issues.push({
          type: 'inaccessible-link-text',
          severity: 'low',
          message: `Section ${index} contains "click here" text which is not accessible`,
          suggestedFix: 'Use descriptive link text instead of "click here"'
        });
      }
    });

    return issues;
  },

  generateAccessibilityReport: function(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues || accessibilityReport.issues.length === 0) {
      return [];
    }

    const report = accessibilityReport.issues.map(issue => ({
      issueType: issue.type,
      status: issue.status || 'pending',
      fixApplied: issue.fixApplied || ''
    }));

    return report;
  },

  calculateAccessibilityScore: function(fixedIssues) {
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

  convertMainToSection: function(source) {
    const mainBlockRegex = /<main\b([^>]*)>([\s\S]*?)<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (!matches || matches.length <= 1) {
      return source;
    }

    let result = source;
    for (let i = 1; i < matches.length; i++) {
      const block = matches[i][0];
      const fixedBlock = block
        .replace(/<main\b([^>]*)>/i, '<section$1>')
        .replace(/<\/main>/i, '</section>');
      result = result.replace(block, fixedBlock);
    }

    return result;
  },

  validateLandmark: function(element) {
    if (!element) {
      return { valid: false, error: 'Element is required' };
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

  createInPageButton: function(options) {
    const button = document.createElement('button');
    button.textContent = options.text || 'Click me';
    button.setAttribute('aria-label', options.ariaLabel || options.text);
    button.className = options.className || 'in-page-button';
    if (options.onClick) {
      button.addEventListener('click', options.onClick);
    }
    return button;
  },

  personName: function(firstName, lastName) {
    return `${firstName} ${lastName}`.trim();
  },

  addLangAttribute: function(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies: function() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
      dependencies: Object.keys(dependencies),
      devDependencies: Object.keys(devDependencies),
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  ensureUniqueLandmarksFromString: function(str) {
    return str;
  }
};

// Client-side helper functions
function setSvgAttributes(svg) {
  if (!svg.hasAttribute('aria-label')) {
    const accessibleName = svg.getAttribute('id') || '';
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
}

function main() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    if (svg) {
      if (!svg.hasAttribute('role')) {
        svg.setAttribute('role', 'img');
      }
      setSvgAttributes(svg);
    }
  });
}

function checkTableStructure(table) {
  if (!table) {
    return { valid: false, error: 'Table element is required' };
  }

  const hasHeader = table.querySelector('thead') !== null;
  const hasBody = table.querySelector('tbody') !== null;
  const hasCaption = table.querySelector('caption') !== null;

  return {
    valid: true,
    hasHeader,
    hasBody,
    hasCaption
  };
}

function validateAccessibility(element) {
  if (!element) {
    return { valid: false, error: 'Element is required' };
  }

  const issues = [];
  const tagName = element.tagName ? element.tagName.toLowerCase() : '';

  if (tagName === 'svg') {
    if (!element.id && !element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_ID);
    }
    if (!element.getAttribute('role')) {
      issues.push(AddressabilityIssues.MISSING_ROLE);
    }
    if (!element.getAttribute('aria-label')) {
      issues.push(AddressabilityIssues.MISSING_ARIA_LABEL);
    }
  }

  if (tagName === 'table') {
    const tableCheck = checkTableStructure(element);
    if (!tableCheck.hasHeader) {
      issues.push(AddressabilityIssues.MISSING_TABLE_HEADER);
    }
    if (!tableCheck.hasBody) {
      issues.push(AddressabilityIssues.MISSING_TABLE_BODY);
    }
    if (!tableCheck.hasCaption) {
      issues.push(AddressabilityIssues.MISSING_TABLE_CAPTION);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

// Server-side functions
const express = require('express');
const { exec } = require('child_process');
const { JSDOM } = require('jsdom');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
    const room = gameData.rooms[roomName];
    if (!room) {
        return { error: 'Room not found' };
    }
    return {
        room: roomName,
        terrain: room.terrain,
        sources: room.sources,
        controller: room.controller
    };
}

function getPlayers() {
    return Object.values(gameData.players);
}

function getPlayerInfo(playerName) {
    return gameData.players[playerName] || { error: 'Player not found' };
}

function getStructures(roomName) {
    return gameData.structures[roomName] || [];
}

function assignTask(creepName, task, target) {
    if (!gameData.creepTasks[creepName]) {
        gameData.creepTasks[creepName] = { task, target, status: 'assigned' };
    } else {
        gameData.creepTasks[creepName].task = task;
        gameData.creepTasks[creepName].target = target;
        gameData.creepTasks[creepName].status = 'assigned';
    }
    return gameData.creepTasks[creepName];
}

function getTasks(creepName) {
    return gameData.creepTasks[creepName] || { error: 'Creep not found' };
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, { encoding: 'utf8' }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout || stderr);
            }
        });
    });
}

function checkAccessibilityIssues(code) {
    const issues = [];

    if (!code || typeof code !== 'string') {
        issues.push({ type: 'error', message: 'Code must be a non-empty string' });
        return issues;
    }

    const patterns = {
        'TODO': /TODO:/,
        'FIXME': /FIXME:?\s*/,
        'HACK': /HACK:/
    };

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

function checkLandmarkElements(html) {
    const landmarkTypes = ['header', 'nav', 'main', 'footer', 'aside', 'section', 'article'];
    const issues = [];
    const landmarks = [];

    if (!html || typeof html !== 'string') {
        issues.push({ type: 'error', message: 'HTML must be a non-empty string' });
        return { landmarks, issues };
    }

    const dom = new JSDOM(html);
    const document = dom.window.document;

    landmarkTypes.forEach(type => {
        const elements = document.getElementsByTagName(type);
        if (elements.length > 0) {
            landmarks.push({
                type,
                count: elements.length,
                elements: Array.from(elements).map(el => ({
                    id: el.id || null,
                    className: el.className || null,
                    ariaLabel: el.getAttribute('aria-label') || null
                }))
            });
        }
    });

    if (document.getElementsByTagName('main').length === 0) {
        issues.push({
            type: 'warning',
            message: 'No <main> landmark found - recommended for better accessibility'
        });
    }

    if (document.getElementsByTagName('main').length > 1) {
        issues.push({
            type: 'error',
            message: 'Multiple <main> landmarks found - only one should exist'
        });
    }

    const ariaLandmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="navigation"], [role="region"], [role="search"]');
    if (ariaLandmarks.length > 0) {
        landmarks.push({
            type: 'aria-landmarks',
            count: ariaLandmarks.length,
            elements: Array.from(ariaLandmarks).map(el => ({
                role: el.getAttribute('role'),
                id: el.id || null,
                className: el.className || null,
                ariaLabel: el.getAttribute('aria-label') || null
            }))
        });
    }

    return {
        landmarks,
        issues,
        generatedAt: new Date().toISOString()
    };
}

initializeGameData();

app.get('/', (req, res) => {
    res.json({ message: 'Screeps API Server', version: '1.0.0' });
});

app.get('/api/rooms/:roomName', (req, res) => {
    const result = scanRoom(req.params.roomName);
    res.json(result);
});

app.get('/api/players', (req, res) => {
    res.json(getPlayers());
});

app.get('/api/players/:playerName', (req, res) => {
    res.json(getPlayerInfo(req.params.playerName));
});

app.get('/api/structures/:roomName', (req, res) => {
    res.json(getStructures(req.params.roomName));
});

app.post('/api/tasks/:creepName', (req, res) => {
    const { task, target } = req.body;
    const result = assignTask(req.params.creepName, task, target);
    res.json(result);
});

app.get('/api/tasks/:creepName', (req, res) => {
    res.json(getTasks(req.params.creepName));
});

app.post('/api/accessibility/scan', (req, res) => {
    const { code } = req.body;
    const report = generateAccessibilityReport(code);
    res.json(report);
});

app.post('/api/landmarks/scan', (req, res) => {
    const { html } = req.body;
    const report = checkLandmarkElements(html);
    res.json(report);
});

app.post('/api/run', async (req, res) => {
    try {
        const { command } = req.body;
        const result = await runCommand(command);
        res.json({ output: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Screeps API Server running on port ${PORT}`);
});

module.exports = {
  AddressabilityIssues,
  main,
  checkTableStructure,
  validateAccessibility,
  app,
  generateAccessibilityReport,
  checkLandmarkElements
};