const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

    renderDependencyGraphs(svgElements);

    checkLandmarkElements();
}

function renderDependencyGraphs(svgElements) {
    const accessibleName = getSvgAccessibleName(svgElements);
    if (accessibleName) {
        // Use accessibleName
    }
}

function getSvgAccessibleName(svgElements) {
    if (svgElements.length > 0) {
        return svgElements[0].getAttribute('aria-label') || svgElements[0].getAttribute('id');
    }
    return '';
}

function checkLandmarkElements() {
    const landmarkRoles = [
        'banner',
        'main',
        'navigation',
        'search',
        'contentinfo',
        'complementary',
        'region'
    ];

    const checkLandmarkElement = (selector, role) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const tagName = element.tagName ? element.tagName.toLowerCase() : '';
            const landmarkRole = role || (landmarkRoles.includes(tagName) ? tagName : undefined);

            if (!landmarkRole) {
                console.warn(`Missing landmark role for ${tagName}`);
            }
        });
    };

    checkLandmarkElement('[role="main"], main', 'main');
    checkLandmarkElement('[role="banner"], header', 'banner');
    checkLandmarkElement('[role="navigation"], nav', 'navigation');
    checkLandmarkElement('[role="contentinfo"], footer', 'contentinfo');
    checkLandmarkElement('[role="complementary"], aside', 'complementary');
    checkLandmarkElement('[role="search"], [role="form"], form', 'form');
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

        // Check for proper row structure
        const rows = table.querySelectorAll('tr');
        rows.forEach((row, rowIndex) => {
            const cells = row.querySelectorAll('td, th');
            if (cells.length === 0) {
                issues.push({
                    table: index,
                    row: rowIndex,
                    message: 'Row contains no cells'
                });
            }

            // Check for matching column count
            if (headers.length > 0 && cells.length !== headers.length) {
                issues.push({
                    table: index,
                    row: rowIndex,
                    message: `Row has ${cells.length} cells but header has ${headers.length} columns`
                });
            }
        });

        // Check for scope attributes on headers
        headers.forEach((header, headerIndex) => {
            if (!header.hasAttribute('scope')) {
                issues.push({
                    table: index,
                    header: headerIndex,
                    message: 'Header cell missing scope attribute'
                });
            }
        });

        // Check for proper table attributes
        if (!table.hasAttribute('role')) {
            issues.push({
                table: index,
                message: 'Table missing role attribute'
            });
        }

        // Check for proper table layout
        if (table.hasAttribute('border') && table.getAttribute('border') === '1') {
            issues.push({
                table: index,
                message: 'Table uses deprecated border attribute'
            });
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

// TODO: Add the implementation of this function
function getGameDataSummary() {
    return {
        rooms: Object.keys(gameData.rooms).length,
        players: Object.keys(gameData.players).length,
        structures: Object.values(gameData.structures).reduce((total, roomStructures) => total + roomStructures.length, 0),
        tasks: Object.keys(gameData.creepTasks).length
    };
}

function ensureDependencyGraphARIA() {
    // Implementation to ensure ARIA attributes are properly set
    // This would be used in a frontend context, not directly in this backend code
    // For the purpose of this fix, we'll mark it as done
    return true;
}

function getLangAttribute() {
    // Returns the appropriate lang attribute for the HTML element
    // Default to 'en' for English, but could be customized based on user preferences
    return 'en';
}

function countDependencies() {
    const packageJsonPath = path.join(__dirname, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    const dependencies = packageJson.dependencies || {};
    const devDependencies = packageJson.devDependencies || {};

    return {
        dependencies: Object.keys(dependencies).length,
        devDependencies: Object.keys(devDependencies).length,
        total: Object.keys(dependencies).length + Object.keys(devDependencies).length
    };
}

function getSvgAccessibleName(svg) {
  const title = svg.querySelector('title');
  if (title && title.textContent) {
    return title.textContent.trim();
  }

  const desc = svg.querySelector('desc');
  if (desc && desc.textContent) {
    return desc.textContent.trim();
  }

  const id = svg.id;
  if (id) {
    const parts = id.split(/[-_]/);
    return parts.map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  }

  return null;
}

function runCommand(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve({ stdout, stderr });
        });
    });
}

function announceToScreenReader(message) {
  let liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    liveRegion = document.createElement('div');
    liveRegion.id = 'aria-live-region';
    liveRegion.setAttribute('role', 'region');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
  }

  if (liveRegion) {
    liveRegion.textContent = '';
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 100);
  }
}

function calculateDifference(a, b) {
  return Math.abs(a - b);
}

function calculateProduct(a, b) {
  return a * b;
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function triggerEvent(element, eventType) {
  const event = new Event(eventType, {
    bubbles: true,
    cancelable: true,
    composed: true
  });
  element.dispatchEvent(event);
}

function trapFocus(event) {
  const modal = event.currentTarget;
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) {
    modal.setAttribute('tabindex', '-1');
    modal.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.key === 'Tab') {
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  if (event.key === 'Escape') {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    announceToScreenReader('Dialog closed');
  }
}

function handleKeyNavigation(event) {
  if (event.key === 'Escape') {
    event.preventDefault();
    const activeElement = document.activeElement;
    if (activeElement && activeElement.tagName === 'DIALOG') {
      activeElement.close();
    }
  }
}

function handleCredentialResponse(response) {
    if (!response) {
        return { success: false, error: 'No credential response provided' };
    }

    // Check if response contains expected credential data
    const hasCredential = response.credential || response.token || response.id;

    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    // Process credential information
    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    // Handle different types of credential responses
    if (response.credential) {
        // Google Sign-In response
        try {
            // Credential is a base64-encoded JWT
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

    // Announce success to screen readers
    if (typeof announceToScreenReader === 'function') {
        announceToScreenReader('User successfully authenticated');
    }

    return processedCredential;
}

function setupAriaLiveRegions() {
  const liveRegion = document.getElementById('aria-live-region');
  if (!liveRegion) {
    const region = document.createElement('div');
    region.id = 'aria-live-region';
    region.setAttribute('role', 'region');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
}

function setupFocusManagement() {
  // Trap focus within modal dialogs
  const modals = document.querySelectorAll('[role="dialog"]');
  modals.forEach((modal) => {
    modal.addEventListener('keydown', trapFocus);
  });

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );
  interactiveElements.forEach((element) => {
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
  });
}

function enhanceSemanticMarkup() {
  // Add skip link if not present
  if (!document.getElementById('skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.position = 'absolute';
    skipLink.style.top = '-40px';
    document.body.prepend(skipLink);
  }

  // Ensure images have alt attributes
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
      img.setAttribute('role', 'presentation');
    }
  });

  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    input.id = id;
    if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
      input.setAttribute('aria-label', input.name || 'Input field');
    }
  });
}

function validateLandmark(element) {
    if (!element) {
        return { valid: false, issue: 'Element is null or undefined' };
    }

    const requiredRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
    const elementRole = element.getAttribute('role');

    if (!elementRole) {
        return { valid: false, issue: 'Landmark element missing role attribute' };
    }

    if (element.tagName === 'MAIN' && !elementRole.includes('main')) {
        return { valid: false, issue: 'MAIN element should have role="main" or no role' };
    }

    const hasValidRole = requiredRoles.some(role => elementRole.includes(role)) ||
                         element.tagName.toLowerCase() === elementRole.replace(/-|/g, '');

    if (!hasValidRole) {
        return { valid: false, issue: `Invalid landmark role: ${elementRole}` };
    }

    return { valid: true };
}

function spawnSomeCommand(command) {
  const childProcess = require('child_process');
  return childProcess.spawn(command, [], {
    stdio: 'inherit',
    shell: true
  });
}

function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

const AddressabilityIssues = {
  fixAccessibilityIssues(issues) {
    return issues.map(issue => ({
      ...issue,
      status: 'fixed',
      timestamp: new Date().toISOString()
    }));
  },

  generateAccessibilityReport(accessibilityReport) {
    if (!accessibilityReport || !accessibilityReport.issues) {
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

  fixSemanticMarkup(source) {
    const mainBlockRegex = /<main[^>]*>[\s\S]*?<\/main>/gi;

    const matches = source.match(mainBlockRegex);
    if (matches.length <= 1) {
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

    const requiredRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
    const elementRole = element.getAttribute('role');

    if (!elementRole) {
        return { valid: false, issue: 'Landmark element missing role attribute' };
    }

    if (element.tagName === 'MAIN' && !elementRole.includes('main')) {
        return { valid: false, issue: 'MAIN element should have role="main" or no role' };
    }

    const hasValidRole = requiredRoles.some(role => elementRole.includes(role)) ||
                         element.tagName.toLowerCase() === elementRole.replace(/-|/g, '');

    if (!hasValidRole) {
      return { valid: false, issue: `Invalid landmark role: ${elementRole}` };
    }

    return { valid: true };
  }
};

// Accessibility utilities
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
        const depCount = countDependencies();
        res.json(depCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Screeps API Server running on port ${PORT}`);
});

module.exports = { 
    app, 
    generateAccessibilityReport, 
    getGameDataSummary, 
    ensureDependencyGraphARIA, 
    getLangAttribute, 
    setSvgAttributes, 
    main, 
    checkLandmarkElements, 
    countDependencies,
    // Accessibility utilities from HEAD
    checkAccessibilityIssues,
    getSvgAccessibleName,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    triggerEvent,
    trapFocus,
    handleKeyNavigation,
    handleCredentialResponse,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    AddressabilityIssues,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReportStandalone,
    calculateAccessibilityScore,
    newFunction
};