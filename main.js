const { add } = require('./math/add');
const { subtract } = require('./math/subtract');
const { multiply } = require('./math/multiply');
const { divide } = require('./math/divide');
const { power } = require('./math/power');
const { squareRoot } = require('./math/squareRoot');
const { factorial } = require('./math/factorial');
const { fibonacci } = require('./math/fibonacci');
const { sum } = require('./statistics/sum');
const { average } = require('./statistics/average');
const { max } = require('./statistics/max');
const { min } = require('./statistics/min');
const { mode } = require('./statistics/mode');
const { median } = require('./statistics/median');
const { newFunction1 } = require('./utils/newFunction1');
const { newFunction2 } = require('./utils/newFunction2');

import { class1, function1, Object1 } from './path/to/module';

// TODO: Add back any required exports that might have been removed
const missingModule = require('./missing/module');

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
function addLangAttribute() {
  document.documentElement.lang = document.documentElement.lang || 'en';
}

// - REACT_027: Validate table accessibility (DONE: validateTableAccessibility)
function validateTableAccessibility(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    if (!table.hasAttribute('caption') && !table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data Table';
      caption.style.cssText = 'font-weight: bold; margin-bottom: 8px;';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }

    const headers = table.querySelectorAll('th');
    headers.forEach((th) => {
      if (!th.hasAttribute('scope')) {
        const row = th.closest('tr');
        const firstCell = row ? row.querySelector('th, td') : null;
        th.setAttribute('scope', th === firstCell ? 'col' : 'row');
        fixedCount++;
      }
    });

    const cells = table.querySelectorAll('td');
    cells.forEach((cell) => {
      if (!cell.hasAttribute('headers') && !cell.hasAttribute('scope')) {
        const row = cell.closest('tr');
        const headerCells = row ? Array.from(row.querySelectorAll('th')) : [];
        if (headerCells.length > 0) {
          cell.setAttribute('headers', headerCells.map(h => h.id || `header-${Math.random().toString(36).substr(2, 9)}`).join(' '));
          fixedCount++;
        }
      }
    });
  });

  return fixedCount;
}

// - REACT_017: Add/fix landmark issues (DONE: checkLandmarkElements, addMainLandmark, ensureUniqueLandmarks, addLandmarkRegions)
function checkLandmarkElements(document) {
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'article', 'search'];
  const issues = [];

  landmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length === 0) {
      issues.push({ role, message: `Missing ${role} landmark` });
    } else if (elements.length > 1 && ['main', 'banner', 'contentinfo'].includes(role)) {
      issues.push({ role, message: `Multiple ${role} landmarks found (${elements.length})` });
    }
  });

  return issues;
}

function addMainLandmark(document) {
  const existingMain = document.querySelector('main, [role="main"]');
  if (!existingMain) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    while (body.firstChild) {
      main.appendChild(body.firstChild);
    }
    body.appendChild(main);
  }
  return document;
}

function ensureUniqueLandmarks(document) {
  const uniqueLandmarkRoles = ['main', 'banner', 'contentinfo'];
  const usedSelectors = {};

  uniqueLandmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"], ${role}`);
    if (elements.length > 1) {
      let index = 1;
      elements.forEach((element) => {
        const existingId = element.id;
        if (!existingId) {
          element.id = `${role}-${index}`;
        }
        element.setAttribute('aria-labelledby', existingId || element.id);
        index++;
      });
    }
  });

  return document;
}

function addLandmarkRegions(document) {
  const regions = document.querySelectorAll('[role="region"]:not([aria-labelledby]):not([aria-label])');
  regions.forEach((region, index) => {
    const existingLabel = region.getAttribute('aria-label') || region.querySelector('h1, h2, h3, h4, h5, h6')?.textContent;
    if (!existingLabel) {
      const heading = region.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const labelId = `region-label-${generateId()}`;
        heading.id = labelId;
        region.setAttribute('aria-labelledby', labelId);
      } else {
        region.setAttribute('aria-label', `Region ${index + 1}`);
      }
    }
  });

  const landmarkSelectors = [
    { selector: 'nav', name: 'navigation' },
    { selector: '[role="banner"]', name: 'banner' },
    { selector: '[role="contentinfo"]', name: 'contentinfo' },
    { selector: 'aside', name: 'complementary' },
    { selector: 'main, [role="main"]', name: 'main' },
    { selector: '[role="region"]', name: 'region' },
    { selector: '[role="article"]', name: 'article' },
    { selector: 'header:not([role])', name: 'banner' },
    { selector: 'footer:not([role])', name: 'contentinfo' }
  ];

  landmarkSelectors.forEach(({ selector, name }) => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      let index = 1;
      elements.forEach((element) => {
        const existingId = element.id;
        if (!existingId) {
          element.id = `${name}-${index}`;
        }
        element.setAttribute('aria-labelledby', `${name}-${index}`);
        index++;
      });
    }
  });

  return document;
}

function validateLandmarkStructure(landmark) {
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region', 'article', 'search', 'form'];
  const role = landmark.getAttribute('role');
  const tagName = landmark.tagName.toLowerCase();
  const validTagLandmarks = { nav: 'navigation', main: 'main', aside: 'complementary', footer: 'contentinfo', header: 'banner', article: 'article', section: 'region' };

  if (role && !validLandmarks.includes(role)) {
    return { valid: false, issue: `Invalid role "${role}" on element` };
  }

  if (validTagLandmarks[tagName] && role && validTagLandmarks[tagName] !== role) {
    return { valid: false, issue: `Role "${role}" conflicts with element tag "${tagName}"` };
  }

  return { valid: true };
}

function validateLandmark(landmark) {
  const result = validateLandmarkStructure(landmark);
  if (!result.valid) {
    return result;
  }

  const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
  const hasLabel = landmark.hasAttribute('aria-label') || 
                   landmark.hasAttribute('aria-labelledby') || 
                   landmark.querySelector('h1, h2, h3, h4, h5, h6') !== null;

  if (!hasLabel && !['main', 'banner'].includes(role)) {
    return { valid: false, issue: `Landmark "${role}" lacks accessible label` };
  }

  return { valid: true };
}

function fixTableStructure(document) {
  const tables = document.querySelectorAll('table');
  let fixedCount = 0;

  tables.forEach((table) => {
    if (!table.hasAttribute('caption') && !table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data Table';
      caption.style.cssText = 'font-weight: bold; margin-bottom: 8px;';
      table.insertBefore(caption, table.firstChild);
      fixedCount++;
    }

    const rows = table.querySelectorAll('tr');
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('th, td');
      cells.forEach((cell) => {
        if (cell.tagName.toLowerCase() === 'th' && !cell.hasAttribute('scope')) {
          const isFirstRow = rowIndex === 0 || row.parentElement.tagName.toLowerCase() === 'thead';
          cell.setAttribute('scope', isFirstRow ? 'col' : 'row');
          fixedCount++;
        }
      });
    });
  });

  return fixedCount;
}

function fixLandmarkIssues(document) {
  let fixedCount = 0;
  
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  landmarkRoles.forEach((role) => {
    const elements = document.querySelectorAll(`[role="${role}"]`);
    if (elements.length > 1) {
      elements.forEach((element, index) => {
        if (index > 0) {
          const heading = element.querySelector('h1,