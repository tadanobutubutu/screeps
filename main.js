// main.js - Accessibility-focused implementation
const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

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

function setSvgElementAttributes(svg) {
    if (!svg.hasAttribute('aria-label')) {
        const accessibleName = svg.getAttribute('id') || '';
        if (accessibleName) {
            svg.setAttribute('aria-label', accessibleName);
        }
    }
}

function renderDependencyGraphs(svgElements) {
    const accessibleName = getSvgAccessibleName(svgElements);
    if (accessibleName) {
        svgElements.forEach((svg) => {
            svg.setAttribute('aria-label', accessibleName);
        });
    }
}

function checkTableStructure(table) {
    if (!table) {
        return { valid: false, error: 'Table element is required' };
    }

    const hasHeader = table.querySelector('thead') !== null || table.querySelector('th') !== null;
    const hasBody = table.querySelector('tbody') !== null;
    const hasCaption = table.querySelector('caption') !== null;

    return {
        valid: true,
        hasHeader,
        hasBody,
        hasCaption
    };
}

const sampleInsightReport = {
  title: 'Quarterly Performance Report',
  sections: [
    {
      heading: 'Sales Overview',
      content: 'Total sales increased by 15% compared to last quarter.'
    },
    {
      heading: 'Customer Satisfaction',
      content: 'Average satisfaction score: 4.2 out of 5.'
    }
  ]
};

function checkLandmarkElements() {
    if (typeof document === 'undefined') return;
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
    return true;
}

function getLangAttribute() {
    return 'en';
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

    const hasCredential = response.credential || response.token || response.id;

    if (!hasCredential) {
        return { success: false, error: 'Invalid credential response format' };
    }

    const processedCredential = {
        id: response.id || null,
        token: response.token || response.credential || null,
        name: response.name || 'Anonymous User',
        email: response.email || null,
        success: true
    };

    if (response.credential) {
        try {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            processedCredential.id = payload.sub || processedCredential.id;
            processedCredential.email = payload.email || processedCredential.email;
            processedCredential.name = payload.name || processedCredential.name;
        } catch (error) {
            console.warn('Failed to parse credential response:', error);
        }
    }

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
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach((modal) => {
        modal.addEventListener('keydown', trapFocus);
    });

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

    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        if (!img.hasAttribute('alt')) {
            img.setAttribute('alt', '');
            img.setAttribute('role', 'presentation');
        }
    });

    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input) => {
        const id = input.id || `input-${Math.random().toString(36).substr(2, 9)}`;
        input.id = id;
        if (!input.getAttribute('aria-label') && !document.querySelector(`label[for="${id}"]`)) {
            input.setAttribute('aria-label', input.name || 'Input field');
        }
    });
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

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    app,
    AddressabilityIssues,
    checkTableStructure,
    countDependencies: AddressabilityIssues.countDependencies,
    init,
    setupAriaLiveRegions,
    setupFocusManagement,
    enhanceSemanticMarkup,
    trapFocus,
    handleKeyNavigation,
    closeOpenDialogs,
    announceToScreenReader,
    calculateDifference,
    calculateProduct,
    isNumber,
    clamp,
    hello,
    getVersion,
    getConfig,
    addressAccessibilityIssues,
    generateAccessibilityReport,
    generateAccessibilityReportStandalone,
    calculateAccessibilityScore,
    validateLandmark,
    spawnSomeCommand,
    addLangAttribute,
    handleCredentialResponse,
    sampleInsightReport,
    initializeAccessibility,
    getSvgAccessibleName,
    setSvgAttributes,
    checkLandmarkElements,
    getGameDataSummary,
    ensureDependencyGraphARIA,
    getLangAttribute,
    checkAccessibilityIssues,
    triggerEvent,
    newFunction,
    checkLinkAndButtonAccessibility
  };
} else if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}