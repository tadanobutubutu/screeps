const AddressabilityIssues = {
  MISSING_ID: 'missing-id',
  MISSING_ALT: 'missing-alt',
  MISSING_ARIA_LABEL: 'missing-aria-label',
  MISSING_ROLE: 'missing-role',
  LOW_CONTRAST: 'low-contrast',
  TINY_SIZE: 'tiny-size',

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

  validateLandmark(element) {
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

  spawnSomeCommand(callback) {
    const child_process = require('child_process');

    const spawnOptions = {  shell: true };

    child_process.spawn('someCommand', [], spawnOptions, (error, stdout, stderr) => {
      if (error) {
        callback(new Error(`someCommand failed: ${error.message}`));
        return;
      }

      callback(null, `someCommand exited with status code: ${stdout}`);
    });
  },

  addLangAttribute(element, lang) {
    element.setAttribute('lang', lang);
  },

  countDependencies() {
    const path = require('path');
    const fs = require('fs');
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

    const dependencies = JSON.parse(packageJson).dependencies || {};
    const devDependencies = JSON.parse(packageJson).devDependencies || {};

    return {
      dependencies: Object.keys(dependencies).length,
      devDependencies: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
  },

  generateUniqueId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
  },

  checkTableStructure(table) {
    const issues = [];
    if (!table.querySelector('thead')) {
      issues.push('Table is missing a thead element');
    }
    if (!table.querySelector('tbody')) {
      issues.push('Table is missing a tbody element');
    }
    return issues;
  },

  ensureDependencyGraphARIA() {
    const graph = document.getElementById('dependency-graph');
    if (graph) {
      graph.setAttribute('role', 'region');
      graph.setAttribute('aria-label', 'Dependency Graph');
    }
  },

  getLangAttribute() {
    return navigator.language || document.documentElement.lang || 'en';
  },

  checkAccessibilityIssues(elements) {
    if (!elements || elements.length === 0) return [];
    return Array.from(elements).map(el => ({
      element: el,
      issues: this.detectAccessibilityIssues([el])
    })).filter(item => item.issues.length > 0);
  },

  triggerEvent(element, eventName, detail = {}) {
    if (element && typeof element.dispatchEvent === 'function') {
      element.dispatchEvent(new CustomEvent(eventName, { detail }));
    }
  },

  getSvgAccessibleName(svg) {
    if (!svg) return '';
    return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || svg.querySelector('title')?.textContent || '';
  },

  setSvgAttributes(svg) {
    if (!svg) return;
  
    // Handle width: set to 24 if missing or less than 24
    const width = svg.getAttribute('width');
    if (!width || parseInt(width) < 24) {
      svg.setAttribute('width', '24');
    }
  
    // Handle height: set to 24 if missing or less than 24
    const height = svg.getAttribute('height');
    if (!height || parseInt(height) < 24) {
      svg.setAttribute('height', '24');
    }
  },

  detectAccessibilityIssues(elements) {
    const issues = [];
  
    elements.forEach((element, index) => {
      if (!element.id) {
        issues.push({
          element: index,
          type: AddressabilityIssues.MISSING_ID,
          message: 'Element is missing an id attribute'
        });
      }
      
      if (!element.getAttribute('role')) {
        issues.push({
          element: index,
          type: AddressabilityIssues.MISSING_ROLE,
          message: 'Element is missing a role attribute'
        });
      }
    });

    return issues;
  },

  initializeAccessibility(container) {
    let svgElements;
    if (container instanceof Element) {
      svgElements = container.querySelectorAll('svg');
    } else if (Array.isArray(container)) {
      svgElements = container;
    } else {
      svgElements = [];
    }

    svgElements.forEach(svg => {
      if (!svg.id) {
        svg.id = this.generateUniqueId();
      }

      if (!svg.getAttribute('role')) {
        svg.setAttribute('role', 'img');
      }

      const accessibleName = this.getSvgAccessibleName(svg);
      if (accessibleName) {
        svg.setAttribute('aria-label', accessibleName);
      }

      this.setSvgAttributes(svg);
    });

    return {
      issues: this.detectAccessibilityIssues(svgElements),
      count: svgElements.length
    };
  },

  handleCredentialResponse(response) {
    if (!response) {
      return {
        success: false,
        message: 'No credential response provided'
      };
    }

    if (!response.token) {
      return {
        success: false,
        message: 'Token is missing from credential response'
      };
    }

    try {
      // Store credentials securely
      const credentialData = {
        token: response.token,
        refreshToken: response.refreshToken || null,
        expiresAt: response.expiresIn ? Date.now() + (response.expiresIn * 1000) : null,
        receivedAt: Date.now()
      };

      // Emit custom event for other components to handle
      if (typeof window !== 'undefined') {
        const credentialEvent = new CustomEvent('credential-response', {
          detail: credentialData,
          bubbles: true
        });
        window.dispatchEvent(credentialEvent);
      }

      return {
        success: true,
        message: 'Credential response handled successfully',
        data: credentialData
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to process credential response: ' + error.message
      };
    }
  },

  getStoredCredentials() {
    const stored = sessionStorage.getItem('credentials');
    if (!stored) return null;

    try {
      const credentials = JSON.parse(stored);
      if (credentials.expiresAt && Date.now() > credentials.expiresAt) {
        sessionStorage.removeItem('credentials');
        return null;
      }
      return credentials;
    } catch (error) {
      return null;
    }
  },

  clearCredentials() {
    sessionStorage.removeItem('credentials');
    if (typeof window !== 'undefined') {
      const clearEvent = new CustomEvent('credentials-cleared', {
        bubbles: true
      });
      window.dispatchEvent(clearEvent);
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
    const player = gameData.players[playerName];
    if (!player) {
        return { error: 'Player not found' };
    }
    return player;
}

function getStructures(roomName) {
    return gameData.structures[roomName] || [];
}

function assignTask(creepName, task, target) {
    if (!creepName || !task || !target) {
        return { error: 'Missing required fields' };
    }

    gameData.creepTasks[creepName] = {
        task: task,
        target: target,
        status: 'active',
        assignedAt: new Date().toISOString()
    };

    return { success: true, task: gameData.creepTasks[creepName] };
}

function getTasks(creepName) {
    return gameData.creepTasks[creepName] || { error: 'No tasks found' };
}

function init() {
    if (typeof document !== 'undefined') {
        const svgElements = document.querySelectorAll('svg');
        AddressabilityIssues.initializeAccessibility(svgElements);
    }
}

function main() {
    init();
    if (typeof document !== 'undefined') {
        const svgElements = document.querySelectorAll('svg');
        AddressabilityIssues.setSvgAttributes(svgElements);
        svgElements.forEach((svg) => {
            AddressabilityIssues.ensureDependencyGraphARIA();
        });
        checkLandmarkElements();
    }
}

function checkLandmarkElements() {
    if (typeof document === 'undefined') return;
    const landmarks = document.querySelectorAll(
        'header, main, nav, aside, footer, section, article, summary, aside, dialog'
    );
    landmarks.forEach(landmark => {
        AddressabilityIssues.validateLandmark(landmark);
    });
}

function getGameDataSummary() {
    return {
        roomsCount: Object.keys(gameData.rooms).length,
        playersCount: Object.keys(gameData.players).length,
        structuresCount: gameData.structures ? Object.keys(gameData.structures).length : 0,
        tasksCount: Object.keys(gameData.creepTasks).length
    };
}

function renderDependencyGraphs() {
    // Placeholder for actual dependency graph rendering
}

function ensureDependencyGraphARIA() {
    // Placeholder to match origin/main's ensureDependencyGraphARIA
}

function renderIndexViews() {
    // Placeholder to match origin/main's renderIndexViews
}

function updateDependencyGraphs() {
    // Placeholder for the actual implementation
}

function updateIndexViews() {
    // Placeholder for the actual implementation
}

function closeOpenDialogs() {
    // Placeholder for the actual implementation
}

function trapFocus(event) {
    const modal = event.target;
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        event.preventDefault();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        event.preventDefault();
    }
}

function handleKeyNavigation(event) {
    if (event.key === 'Escape') {
        const activeModal = document.querySelector('[role="dialog"][tabindex="0"]');
        if (activeModal) {
            activeModal.setAttribute('tabindex', '-1');
            activeModal.focus();
        }
    }
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

function checkTableStructure() {
    // Placeholder to satisfy export
}

function calculateDifference(a, b) {
    return a - b;
}

function calculateProduct(a, b) {
    return a * b;
}

function isNumber(value) {
    return typeof value === 'number';
}

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

const hello = () => {
  return 'Hello from main.js';
};

function newFunction() {
  return 'New function added from origin/main';
}

function getVersion() {
  return '1.0.0';
}

function getConfig(key) {
  const config = {
    debug: false,
    version: '1.0.0',
    apiUrl: 'https://api.example.com'
  };
  return config[key] || config;
}

function addressAccessibilityIssues(issues) {
  if (!issues) {
    return AddressabilityIssues.addressAccessibilityIssues(sampleInsightReport);
  }
  const fixedIssues = [];

  issues.forEach(issue => {
    switch (issue.type) {
      case 'missing-alt-text':
        fixedIssues.push({ ...issue, status: 'fixed', fixApplied: 'Added alt attribute' });
        break;
      case 'missing-aria-label':
        fixedIssues.push({ ...issue, status: 'fixed', fixApplied: 'Added aria-label' });
        break;
      case 'color-contrast':
        fixedIssues.push({ ...issue, status: 'fixed', fixApplied: 'Adjusted color contrast' });
        break;
      default:
        fixedIssues.push({ ...issue, status: 'pending', fixApplied: '' });
    }
  });

  return fixedIssues;
}

function generateAccessibilityReportStandalone() {
  return {
    timestamp: new Date().toISOString(),
    issues: [],
    score: 0,
    totalChecks: 0
  };
}

function calculateAccessibilityScore() {
  const report = generateAccessibilityReportStandalone();
  const fixedIssues = report.issues.filter(issue => issue.status === 'fixed');
  return AddressabilityIssues.calculateAccessibilityScore(fixedIssues);
}

function runCommand(command) {
    return `Executing: ${command}`;
}

const sampleInsightReport = {
  sections: [
    { heading: 'Introduction', content: 'Welcome to the report.' },
    { heading: 'Analysis', content: 'Details here.' }
  ]
};

initializeGameData();

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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
    const report = AddressabilityIssues.generateAccessibilityReport(code);
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

app.get('/api/dependencies', (req, res) => {
    try {
        const depCount = AddressabilityIssues.countDependencies();
        res.json(depCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/credentials', (req, res) => {
    const credentials = AddressabilityIssues.getStoredCredentials();
    res.json({ credentials });
});

app.post('/api/credentials', (req, res) => {
    const result = AddressabilityIssues.handleCredentialResponse(req.body);
    res.json(result);
});

app.post('/api/credentials/clear', (req, res) => {
    AddressabilityIssues.clearCredentials();
    res.json({ success: true });
});

if (typeof app !== 'undefined' && typeof app.listen === 'function') {
    app.listen(PORT, () => {
        console.log(`Screeps API Server running on port ${PORT}`);
    });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    initializeAccessibility,
    getSvgAccessibleName: AddressabilityIssues.getSvgAccessibleName,
    setSvgAttributes: AddressabilityIssues.setSvgAttributes,
    checkTableStructure,
    generateUniqueId: AddressabilityIssues.generateUniqueId,
    detectAccessibilityIssues: AddressabilityIssues.detectAccessibilityIssues,
    handleCredentialResponse: AddressabilityIssues.handleCredentialResponse,
    getStoredCredentials: AddressabilityIssues.getStoredCredentials,
    clearCredentials: AddressabilityIssues.clearCredentials,
    gameData,
    initializeGameData,
    scanRoom,
    getPlayers,
    getPlayerInfo,
    getStructures,
    assignTask,
    getTasks,
    init,
    main,
    checkLandmarkElements,
    getGameDataSummary,
    ensureDependencyGraphARIA,
    getLangAttribute: AddressabilityIssues.getLangAttribute,
    checkAccessibilityIssues: AddressabilityIssues.checkAccessibilityIssues,
    triggerEvent: AddressabilityIssues.triggerEvent,
    newFunction,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReportStandalone,
    calculateAccessibilityScore,
    validateLandmark: AddressabilityIssues.validateLandmark,
    spawnSomeCommand: AddressabilityIssues.spawnSomeCommand,
    addLangAttribute: AddressabilityIssues.addLangAttribute,
    addDocumentLangAttribute: AddressabilityIssues.addLangAttribute,
    sampleInsightReport,
    runCommand,
    app,
    checkTableStructure: AddressabilityIssues.checkTableStructure
  };
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}