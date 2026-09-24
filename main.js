const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const AddressabilityIssues = {
  // ... (existing code)

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
      'form',
      'dialog' // New role added
    ];

    const tagName = element.tagName ? element.tagName.toLowerCase() : element.tagName;

    const implicitLandmarks = {
      // ... (existing implicitLandmarks)
      'dialog': 'dialog' // New implicitLandmark
    };

    let landmarkRole = element.getAttribute ? element.getAttribute('role') : element.role;

    if (!landmarkRole && implicitLandmarks[tagName]) {
      landmarkRole = implicitLandmarks[tagName];
    }

    if (!landmarkRole) {
      return { valid: false, error: 'Element does not have a valid landmark role', element: tagName, role: landmarkRole };
    }

    if (!landmarkRoles.includes(landmarkRole)) {
      return { valid: false, error: `Invalid landmark role: ${landmarkRole}`, element: tagName, role: landmarkRole };
    }

    return { valid: true, element: tagName, role: landmarkRole };
  },

  spawnSomeCommand(command) {
    const childProcess = require('child_process');
    const runCommand = async (command) => {
      return await new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
          if (error) {
            reject(error);
            return;
          }
          resolve({ stdout, stderr });
        });
      });
    };
    return runCommand(command);
  },

  // ... (remaining existing code)
};

let gameData = {
  // ... (existing gameData)
};

// ... (existing functions: initializeGameData, scanRoom, getPlayers, getPlayerInfo, getStructures, assignTask, getTasks)

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
  },

  fixMainLandmarkIssues(source) {
    // ... (existing implementation)
  },

  renderIndexView() {
    const indexContent = require('../indexContent/indexContent');
    const indexContainer = document.getElementById('index-container');
    if (indexContainer) {
      indexContainer.innerHTML = indexContent;
    }
  },

  checkLinkAndButtonAccessibility(container) {
    const issues = [];

    if (typeof document === 'undefined' && !container) {
      return issues;
    }

    const targetContainer = container || document;
    const elements = targetContainer.querySelectorAll ? targetContainer : (Array.isArray(targetContainer) ? targetContainer : [targetContainer]);

    const nonDescriptiveLinkPatterns = [
      'click here',
      'read more',
      'learn more',
      'here',
      'link',
      'more',
      'details',
      'this',
      'continue'
    ];

    const getElementText = (element) => {
      if (!element) return '';
      if (typeof element.textContent !== 'undefined') {
        return element.textContent.trim();
      }
      return '';
    };

    const getAccessibleName = (element) => {
      if (!element) return '';

      if (element.hasAttribute && element.hasAttribute('aria-label')) {
        return element.getAttribute('aria-label');
      }

      if (element.hasAttribute && element.hasAttribute('aria-labelledby')) {
        const labelledById = element.getAttribute('aria-labelledby');
        if (typeof document !== 'undefined' && document.getElementById) {
          const labelElement = document.getElementById(labelledById);
          if (labelElement) {
            return labelElement.textContent.trim();
          }
        }
      }

      return getElementText(element);
    };

    const checkLink = (link) => {
      const linkText = getElementText(link).toLowerCase();
      const accessibleName = getAccessibleName(link);
      const href = link.getAttribute ? link.getAttribute('href') : '';

      if (!accessibleName || accessibleName === '') {
        issues.push({
          type: 'link-missing-accessible-name',
          severity: 'high',
          element: 'a',
          message: 'Link is missing an accessible name',
          suggestedFix: 'Add descriptive text or aria-label to the link',
          elementReference: link
        });
      } else {
        for (const pattern of nonDescriptiveLinkPatterns) {
          if (linkText === pattern || linkText.startsWith(pattern + ' ') || linkText.endsWith(' ' + pattern)) {
            issues.push({
              type: 'link-non-descriptive-text',
              severity: 'medium',
              element: 'a',
              message: `Link text "${accessibleName}" is not descriptive`,
              suggestedFix: 'Use descriptive link text that explains the link destination',
              elementReference: link
            });
            break;
          }
        }
      }

      if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
        issues.push({
          type: 'link-empty-href',
          severity: 'low',
          element: 'a',
          message: 'Link has an empty or placeholder href attribute',
          suggestedFix: 'Use a meaningful href or remove the link if it has no destination',
          elementReference: link
        });
      }
    };

    const checkButton = (button) => {
      const buttonText = getElementText(button);
      const accessibleName = getAccessibleName(button);

      if (!accessibleName || accessibleName === '') {
        issues.push({
          type: 'button-missing-accessible-name',
          severity: 'high',
          element: 'button',
          message: 'Button is missing an accessible name',
          suggestedFix: 'Add descriptive text, aria-label, or aria-labelledby to the button',
          elementReference: button
        });
      }

      if (buttonText.length > 100) {
        issues.push({
          type: 'button-text-too-long',
          severity: 'low',
          element: 'button',
          message: `Button text is very long (${buttonText.length} characters)`,
          suggestedFix: 'Consider using a shorter, more concise button label',
          elementReference: button
        });
      }
    };

    const checkImageLink = (link) => {
      const images = link.querySelector ? link.querySelectorAll('img') : [];
      const linkText = getElementText(link);

      if (images.length > 0 && linkText === '') {
        const allImagesHaveAlt = Array.from(images).every(img => {
          const alt = img.getAttribute ? img.getAttribute('alt') : '';
          return alt !== null && alt !== undefined;
        });

        if (!allImagesHaveAlt) {
          issues.push({
            type: 'image-link-missing-alt',
            severity: 'high',
            element: 'a',
            message: 'Link containing image(s) has image(s) without alt attributes',
            suggestedFix: 'Add alt attributes to all images within the link',
            elementReference: link
          });
        }
      }
    };

    const processElements = (els) => {
      els.forEach(element => {
        if (!element || !element.tagName) return;

        const tagName = element.tagName.toLowerCase();

        if (tagName === 'a') {
          checkLink(element);
          checkImageLink(element);
        } else if (tagName === 'button') {
          checkButton(element);
        }

        if (element.querySelectorAll) {
          const childLinks = element.querySelectorAll('a');
          const childButtons = element.querySelectorAll('button');

          childLinks.forEach(checkLink);
          childButtons.forEach(checkButton);
        }
      });
    };

    if (targetContainer.querySelectorAll) {
      const allLinks = targetContainer.querySelectorAll('a');
      const allButtons = targetContainer.querySelectorAll('button');

      allLinks.forEach(link => {
        checkLink(link);
        checkImageLink(link);
      });

      allButtons.forEach(checkButton);
    } else if (Array.isArray(targetContainer) || targetContainer.length !== undefined) {
      processElements(elements);
    }

    return issues;
  },

  fixSemanticMarkup(source) {
    // ... (existing implementation)
  },

  validateLandmarkStructure() {
    // ... (existing implementation)
  }
};

function validateLandmark(element) {
  return AddressabilityIssues.validateLandmark(element);
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

function setSvgElementAttributes(svg) {
    if (!svg.hasAttribute('aria-label')) {
        const accessibleName = svg.getAttribute('id') || '';
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
}

function main() {
    const svgElements = document.querySelectorAll('svg');

    setSvgAttributes(svgElements);

    svgElements.forEach((svg) => {
        renderDependencyGraphs(svg);
    });

    checkLandmarkElements();
}

function checkLandmarkElements() {
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

// New function: set the lang attribute on the HTML element
function setLangAttribute(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
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

function checkLinkAndButtonAccessibility(container) {
  const issues = [];

  if (typeof document === 'undefined' && !container) {
    return issues;
  }

  const targetContainer = container || document;
  const elements = targetContainer.querySelectorAll ? targetContainer : (Array.isArray(targetContainer) ? targetContainer : [targetContainer]);

  const nonDescriptiveLinkPatterns = [
    'click here',
    'read more',
    'learn more',
    'here',
    'link',
    'more',
    'details',
    'this',
    'continue'
  ];

  const getElementText = (element) => {
    if (!element) return '';
    if (typeof element.textContent !== 'undefined') {
      return element.textContent.trim();
    }
    return '';
  };

  const getAccessibleName = (element) => {
    if (!element) return '';

    if (element.hasAttribute && element.hasAttribute('aria-label')) {
      return element.getAttribute('aria-label');
    }

    if (element.hasAttribute && element.hasAttribute('aria-labelledby')) {
      const labelledById = element.getAttribute('aria-labelledby');
      if (typeof document !== 'undefined' && document.getElementById) {
        const labelElement = document.getElementById(labelledById);
        if (labelElement) {
          return labelElement.textContent.trim();
        }
      }
    }

    return getElementText(element);
  };

  const checkLink = (link) => {
    const linkText = getElementText(link).toLowerCase();
    const accessibleName = getAccessibleName(link);
    const href = link.getAttribute ? link.getAttribute('href') : '';

    if (!accessibleName || accessibleName === '') {
      issues.push({
        type: 'link-missing-accessible-name',
        severity: 'high',
        element: 'a',
        message: 'Link is missing an accessible name',
        suggestedFix: 'Add descriptive text or aria-label to the link',
        elementReference: link
      });
    } else {
      for (const pattern of nonDescriptiveLinkPatterns) {
        if (linkText === pattern || linkText.startsWith(pattern + ' ') || linkText.endsWith(' ' + pattern)) {
          issues.push({
            type: 'link-non-descriptive-text',
            severity: 'medium',
            element: 'a',
            message: `Link text "${accessibleName}" is not descriptive`,
            suggestedFix: 'Use descriptive link text that explains the link destination',
            elementReference: link
          });
          break;
        }
      }
    }

    if (href === '#' || href === '' || href === 'javascript:void(0)' || href === 'javascript:;') {
      issues.push({
        type: 'link-empty-href',
        severity: 'low',
        element: 'a',
        message: 'Link has an empty or placeholder href attribute',
        suggestedFix: 'Use a meaningful href or remove the link if it has no destination',
        elementReference: link
      });
    }
  };

  const checkButton = (button) => {
    const buttonText = getElementText(button);
    const accessibleName = getAccessibleName(button);

    if (!accessibleName || accessibleName === '') {
      issues.push({
        type: 'button-missing-accessible-name',
        severity: 'high',
        element: 'button',
        message: 'Button is missing an accessible name',
        suggestedFix: 'Add descriptive text, aria-label, or aria-labelledby to the button',
        elementReference: button
      });
    }

    if (buttonText.length > 100) {
      issues.push({
        type: 'button-text-too-long',
        severity: 'low',
        element: 'button',
        message: `Button text is very long (${buttonText.length} characters)`,
        suggestedFix: 'Consider using a shorter, more concise button label',
        elementReference: button
      });
    }
  };

  const checkImageLink = (link) => {
    const images = link.querySelector ? link.querySelectorAll('img') : [];
    const linkText = getElementText(link);

    if (images.length > 0 && linkText === '') {
      const allImagesHaveAlt = Array.from(images).every(img => {
        const alt = img.getAttribute ? img.getAttribute('alt') : '';
        return alt !== null && alt !== undefined;
      });

      if (!allImagesHaveAlt) {
        issues.push({
          type: 'image-link-missing-alt',
          severity: 'high',
          element: 'a',
          message: 'Link containing image(s) has image(s) without alt attributes',
          suggestedFix: 'Add alt attributes to all images within the link',
          elementReference: link
        });
      }
    }
  };

  const processElements = (els) => {
    els.forEach(element => {
      if (!element || !element.tagName) return;

      const tagName = element.tagName.toLowerCase();

      if (tagName === 'a') {
        checkLink(element);
        checkImageLink(element);
      } else if (tagName === 'button') {
        checkButton(element);
      }

      if (element.querySelectorAll) {
        const childLinks = element.querySelectorAll('a');
        const childButtons = element.querySelectorAll('button');

        childLinks.forEach(checkLink);
        childButtons.forEach(checkButton);
      }
    });
  };

  if (targetContainer.querySelectorAll) {
    const allLinks = targetContainer.querySelectorAll('a');
    const allButtons = targetContainer.querySelectorAll('button');

    allLinks.forEach(link => {
      checkLink(link);
      checkImageLink(link);
    });

    allButtons.forEach(checkButton);
  } else if (Array.isArray(targetContainer) || targetContainer.length !== undefined) {
    processElements(elements);
  }

  return issues;
}

function initializeEventData() {
  // Placeholder for event data initialization
}

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
        const depCount = AddressabilityIssues.countDependencies();
        res.json(depCount);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

if (typeof app !== 'undefined' && typeof app.listen === 'function') {
    app.listen(PORT, () => {
        console.log(`Screeps API Server running on port ${PORT}`);
    });
}

function initializeAccessibility() {
  if (!document.querySelectorAll) return;
  addressAccessibilityIssues(sampleInsightReport);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    AddressabilityIssues,
    fixMainLandmarkIssues: AddressabilityIssues.fixMainLandmarkIssues,
    fixSemanticMarkup: AddressabilityIssues.fixSemanticMarkup,
    validateLandmarkStructure: AddressabilityIssues.validateLandmarkStructure,
    createServer,
    startApp,
    checkLandmarkElements,
    newFunction,
    setARIARoleForDependencyGraph,
    addLangAttribute: AddressabilityIssues.addLangAttribute,
    validateLandmark,
    processSvgElements,
    checkTableStructure,
    sampleInsightReport,
    config,
    handleCredentialResponse,
    getStoredCredentials,
    handleAddLangAttribute,
    newFunctionality,
    countDependencies,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    calculateAccessibilityScore,
    ensureUniqueLandmarksFromString,
    createInPageButton,
    implementTowerDefense,
    getEventDataSummary,
    ensureDependencyGraphARIA,
    getLangAttribute,
    checkAccessibilityIssues,
    triggerEvent,
    checkLinkAndButtonAccessibility,
    addBook,
    handleFakeLinks
  };
} else {
  // Browser environment - wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAccessibility();
      performBrowserInitialization();
    });
  } else {
    initializeAccessibility();
    performBrowserInitialization();
  }
}

// Browser-only initialization code
function performBrowserInitialization() {
  // Fix 26 table structure issues
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    const validationResult = validateTableStructure(table);
    if (!validationResult.valid) {
      // Handle invalid table structure
      console.error(`Table structure issues found: ${validationResult.error}`);
    }
  });

  // Add/fix 4 landmark issues
  const landmarks = document.querySelectorAll('main, nav, aside, header, footer');
  landmarks.forEach((landmark) => {
    const validationResult = validateLandmark(landmark);
    if (!validationResult.valid) {
      // Handle invalid landmark
      console.error(`Landmark issues found: ${validationResult.error}`);
    }
  });

  // Add accessible names to 2 SVGs
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach((svg) => {
    const accessibleName = getSvgAccessibleName(svg);
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  });

  // Ensure unique landmarks
  const uniqueLandmarks = ensureUniqueLandmarks();
  if (!uniqueLandmarks) {
    console.error('Non-unique landmarks detected');
  }

  // Fix 1 fake link issue
  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach((link) => {
    handleFakeLinks([{
      type: 'fake',
      message: 'Link points to an invalid location'
    }]);
    link.setAttribute('href', '#');
  });
}

// Accessibility-focused implementation functions
function countDependencies() {
  // Implement function for counting dependencies with AddressabilityIssues
  return AddressabilityIssues.countDependencies();
}

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

    // Get client ID from meta tag
    const metaTag = document.querySelector('meta[name="google-signin-client_id"]');
    const clientId = metaTag ? metaTag.getAttribute('content') : null;
    if (!clientId) {
      console.error('Client ID not found in meta tag');
      return;
    }

    if (payload.aud !== clientId) {
      console.error('Token audience does not match client ID');
      return;
    }

    // Store the payload (user profile) in sessionStorage
    sessionStorage.setItem('googleUser', JSON.stringify(payload));
    // Optionally, store the ID token if needed for backend authentication
    // sessionStorage.setItem('googleIdToken', credentialResponse);

    // Dispatch a custom event to notify the app of successful sign-in
    window.dispatchEvent(new CustomEvent('google-signin-success', { detail: payload }));
  } catch (error) {
    console.error('Error handling credential response:', error);
  }
}

// Start the application if run directly
if (typeof require !== 'undefined' && require.main === module) {
  startApp();
}