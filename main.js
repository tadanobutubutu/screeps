/**
 * Main application entry point
 * Handles server initialization, routing, view rendering,
 * accessibility enhancements, and Screeps bot logic.
 */

const express = require('express');
const path = require('path');
const fs = require('fs');

// Express server setup
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* -------------------------------------------------------------------------- */
/* Accessibility / DOM Helper Functions (client‑side)                        */
/* -------------------------------------------------------------------------- */

// Helper to ensure an element has a given ID
function ensureElementHasId(elementId) {
  const el = document.getElementById(elementId);
  if (el && !el.id) el.id = elementId;
}

// Helper to add/ensure ARIA label
function addAriaLabel(elementId, label) {
  const el = document.getElementById(elementId);
  if (el) el.setAttribute('aria-label', label);
}

/* Language helpers */
function getFullLangAttribute() {
  return 'en-US';
}
function getLangAttribute() {
  return getFullLangAttribute();
}

/* Simple person name placeholder */
function personName() {
  return 'User';
}

/* Landmark validation & structure fixes */
function validateLandmark() {
  const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
  landmarks.forEach(el => {
    if (el.tagName === 'HEADER' && !el.hasAttribute('role')) el.setAttribute('role', 'banner');
    else if (el.tagName === 'NAV' && !el.hasAttribute('role')) el.setAttribute('role', 'navigation');
    else if (el.tagName === 'MAIN' && !el.hasAttribute('role')) el.setAttribute('role', 'main');
    else if (el.tagName === 'ASIDE' && !el.hasAttribute('role')) el.setAttribute('role', 'complementary');
    else if (el.tagName === 'FOOTER' && !el.hasAttribute('role')) el.setAttribute('role', 'contentinfo');
  });
}
function validateLandmarkStructure() {
  const mainLandmarks = document.querySelectorAll('main[role="main"], [role="main"]');
  if (mainLandmarks.length > 1) {
    for (let i = 1; i < mainLandmarks.length; i++) mainLandmarks[i].removeAttribute('role');
  }
  const header = document.querySelector('header, [role="banner"]');
  if (header) header.setAttribute('role', 'banner');
  const footer = document.querySelector('footer, [role="contentinfo"]');
  if (footer) footer.setAttribute('role', 'contentinfo');
}

/* Table accessibility */
function validateTableAccessibility(table) {
  if (!table) return;
  if (!table.hasAttribute('role')) table.setAttribute('role', 'table');
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.hasAttribute('aria-label');
  const hasAriaLabelledby = table.hasAttribute('aria-labelledby');
  if (!hasCaption && !hasAriaLabel && !hasAriaLabelledby) {
    table.setAttribute('aria-label', 'Data table');
  }
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  if (thead && !thead.hasAttribute('role')) thead.setAttribute('role', 'rowgroup');
  if (tbody && !tbody.hasAttribute('role')) tbody.setAttribute('role', 'rowgroup');
  const rows = table.querySelectorAll('tr');
  rows.forEach(row => {
    if (!row.hasAttribute('role')) row.setAttribute('role', 'row');
    const cells = row.querySelectorAll('td, th');
    const hasHeaderCells = row.querySelectorAll('th').length > 0;
    cells.forEach(cell => {
      if (!cell.hasAttribute('role')) {
        if (hasHeaderCells && cell.tagName === 'TH') cell.setAttribute('role', 'columnheader');
        else if (cell.tagName === 'TD') cell.setAttribute('role', 'cell');
        else if (cell.tagName === 'TH') cell.setAttribute('role', 'columnheader');
      }
      if (cell.tagName === 'TH' && !cell.hasAttribute('scope')) cell.setAttribute('scope', 'col');
    });
  });
}
function validateTableStructure(table) {
  if (!table) return;
  const rows = table.querySelectorAll('tr');
  if (rows.length === 0) return;
  if (!table.querySelector('thead')) {
    const thead = document.createElement('thead');
    const firstRow = rows[0];
    const hasHeaderCells = firstRow.querySelectorAll('th').length > 0;
    if (hasHeaderCells) {
      thead.appendChild(firstRow);
      table.insertBefore(thead, table.firstChild);
    }
  }
  if (!table.querySelector('tbody')) {
    const tbody = document.createElement('tbody');
    const allRows = table.querySelectorAll('tr');
    const rowsToMove = [];
    allRows.forEach(row => {
      const thead = table.querySelector('thead');
      if (!thead || !thead.contains(row)) rowsToMove.push(row);
    });
    rowsToMove.forEach(row => tbody.appendChild(row));
    table.appendChild(tbody);
  }
  const headers = table.querySelectorAll('th');
  const dataCells = table.querySelectorAll('td');
  headers.forEach((h, i) => {
    if (!h.hasAttribute('id')) h.id = `header-${i}`;
  });
  dataCells.forEach((c, i) => {
    if (!c.hasAttribute('headers') && headers.length) {
      const idx = i % headers.length;
      c.setAttribute('headers', `header-${idx}`);
    }
  });
}
function ensureElementsHaveIds(elements) {
  return Array.from(elements).map((el, i) => {
    if (!el.id) el.id = `element-${i}`;
    return el;
  });
}

/* Unique landmarks */
function ensureUniqueLandmarks() {
  const types = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  types.forEach(role => {
    const els = document.querySelectorAll(`[role="${role}"]`);
    if (els.length > 1) {
      for (let i = 1; i < els.length; i++) {
        els[i].removeAttribute('role');
        els[i].setAttribute('data-landmark-duplicate', 'true');
      }
    }
  });
}

/* SVG accessibility */
function getSvgAccessibleName(svg) {
  if (!svg) return 'SVG graphic';
  const aria = svg.getAttribute('aria-label');
  const title = svg.querySelector('title');
  if (aria) return aria;
  if (title && title.textContent) return title.textContent;
  return 'Interactive SVG graphic';
}
function setSvgAttributes(svg, name) {
  if (!svg) return;
  svg.setAttribute('aria-label', name);
  if (svg.hasAttribute('onclick') || svg.getAttribute('role') === 'button') {
    svg.setAttribute('tabindex', '0');
    if (!svg.hasAttribute('role')) svg.setAttribute('role', 'button');
  }
  if (svg.hasAttribute('data-dynamic')) svg.setAttribute('aria-live', 'polite');
}

/* In‑page “skip to content” button */
function createInPageButton() {
  const btn = document.createElement('button');
  btn.setAttribute('aria-label', 'Skip to main content');
  btn.textContent = 'Skip to main content';
  btn.addEventListener('click', () => {
    const main = document.querySelector('main, [role="main"]');
    if (main) {
      main.focus();
      main.scrollIntoView();
    }
  });
  document.body.appendChild(btn);
}

/* Accessible link creation */
function createAccessibleLink(text, href) {
  const link = document.createElement('a');
  link.href = href;
  link.textContent = text;
  if (!text || text.trim() === '') link.setAttribute('aria-label', href);
  link.setAttribute('title', text);
  return link;
}

/* Consolidated accessibility runner */
function handleAccessibilityIssues() {
  ensureUniqueLandmarks();
  validateLandmark();
  validateLandmarkStructure();
  document.querySelectorAll('table').forEach(t => {
    validateTableAccessibility(t);
    validateTableStructure(t);
  });
  document.querySelectorAll('svg').forEach(svg => {
    const name = getSvgAccessibleName(svg);
    setSvgAttributes(svg, name);
  });
  handleFakeLinks();
}

/* Comprehensive fix per insight report */
function fixAccessibilityIssues() {
  document.documentElement.setAttribute('lang', getLangAttribute());
  document.querySelectorAll('table').forEach(t => {
    validateTableAccessibility(t);
    validateTableStructure(t);
  });
  validateLandmark();
  validateLandmarkStructure();
  ensureUniqueLandmarks();
  document.querySelectorAll('svg').forEach(svg => {
    const name = getSvgAccessibleName(svg);
    setSvgAttributes(svg, name);
  });
  ensureUniqueLandmarks();
  fixFakeLinkIssues();
  const dg = document.getElementById('dependencyGraph');
  if (dg && !dg.hasAttribute('role')) {
    dg.setAttribute('role', 'region');
    dg.setAttribute('aria-label', 'Dependency graph visualization');
  }
}

/* Link validation */
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  links.forEach((link, i) => {
    const hasText = link.textContent.trim().length > 0;
    const hasAria = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');
    const hasImgAlt = link.querySelector('img[alt]');
    if (!hasText && !hasAria && !hasTitle && !hasImgAlt) {
      issues.push({ element: link, issue: 'Link has no accessible name', index: i });
    }
    if (link.href === '#' || link.href === '') {
      issues.push({ element: link, issue: 'Link has empty href', index: i });
    }
  });
  return issues;
}

/* Fake‑link conversion */
function handleFakeLinks() {
  const selectors = ['[onclick]:not(a)', '[role="link"]:not(a)', 'div[style*="cursor: pointer"]', 'span[style*="cursor: pointer"]'];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      if (el.hasAttribute('onclick') || el.getAttribute('role') === 'link') {
        const btn = document.createElement('button');
        btn.textContent = el.textContent;
        btn.setAttribute('aria-label', el.textContent || 'Button');
        if (el.hasAttribute('onclick')) btn.setAttribute('onclick', el.getAttribute('onclick'));
        el.parentNode.replaceChild(btn, el);
      }
    });
  });
}
function fixFakeLinkIssues() {
  const fake = document.querySelectorAll('[role="link"]:not(a), div[onclick], span[onclick]');
  fake.forEach(el => {
    if (el.tagName === 'BUTTON') return;
    const btn = document.createElement('button');
    btn.textContent = el.textContent || 'Button';
    btn.setAttribute('aria-label', el.textContent || `Button`);
    if (el.hasAttribute('id')) btn.id = el.id;
    if (el.hasAttribute('onclick')) btn.setAttribute('onclick', el.getAttribute('onclick'));
    el.parentNode.replaceChild(btn, el);
  });
}

/* Google Sign‑in button */
function googleSignIn() {
  const btn = document.querySelector('[data-google-signin]');
  if (btn) {
    btn.setAttribute('aria-label', 'Sign in with Google');
    btn.setAttribute('role', 'button');
  }
}

/* Initial DOM‑ready work */
document.addEventListener('DOMContentLoaded', () => {
  // Skip‑to‑content button
  createInPageButton();
  ensureElementHasId('inPageButton');
  addAriaLabel('inPageButton', 'Accessibility menu');

  // Table accessibility scan
  document.querySelectorAll('table').forEach(t => {
    validateTableAccessibility(t);
    validateTableStructure(t);
  });

  // Fake link cleanup
  handleFakeLinks();

  // Button IDs
  document.querySelectorAll('[role="button"]').forEach((b, i) => {
    if (!b.id) b.id = `button-${i}`;
  });

  // Run overall fixes
  fixAccessibilityIssues();
});

/* -------------------------------------------------------------------------- */
/* Server routes & rendering                                                 */
/* -------------------------------------------------------------------------- */

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Application status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    service: 'main-app',
    version: process.env.APP_VERSION || '1.0.0',
    uptime: process.uptime()
  });
});

/* Render index view – generic handler */
function renderIndexView(req, res, options = {}) {
  const defaultOptions = {
    title: 'Welcome',
    user: req.user || null,
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0'
  };
  const viewOptions = { ...defaultOptions, ...options };

  const indexPath = path.join(__dirname, 'views', 'index.ejs');
  const hasCustomTemplate = fs.existsSync(indexPath);

  if (hasCustomTemplate) {
    res.render('index', viewOptions);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${viewOptions.title}</title>
        <style>
          body { font-family: system-ui, sans-serif; max-width: 800px; margin: 2rem auto; padding: 0 1rem; }
          .card { border: 1px solid #ddd; border-radius: 8px; padding: 1.5rem; margin: 1rem 0; }
          .meta { color: #666; font-size: 0.9rem; }
        </style>
      </head>
      <body>
        <h1>${viewOptions.title}</h1>
        <div class="card">
          <p>Application is running successfully.</p>
          <p class="meta">Version: ${viewOptions.version}</p>
          <p class="meta">Timestamp: ${viewOptions.timestamp}</p>
          ${viewOptions.user ? `<p class="meta">User: ${JSON.stringify(viewOptions.user)}</p>` : ''}
        </div>
      </body>
      </html>
    `);
  }
}

// Home page route
app.get('/', (req, res) => {
  renderIndexView(req, res, { title: 'Home Page' });
});

// Error handlers
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
      status: err.status || 500
    }
  });
});

/* -------------------------------------------------------------------------- */
/* Screeps bot / game loop (executed only in Screeps runtime)               */
/* -------------------------------------------------------------------------- */

function wrapPrimaryContentInMain() {
  const primary = document.querySelector('.primary-content, #main-content');
  if (primary && primary.tagName !== 'MAIN') {
    const mainEl = document.createElement('main');
    mainEl.setAttribute('role', 'main');
    while (primary.firstChild) mainEl.appendChild(primary.firstChild);
    primary.appendChild(mainEl);
    return mainEl;
  }
  return primary;
}
function addFixLandmarkIssues() {
  const landmarks = document.querySelectorAll('[role], header, nav, main, aside, footer');
  landmarks.forEach(el => {
    if (el.tagName === 'HEADER' && !el.hasAttribute('role')) el.setAttribute('role', 'banner');
    else if (el.tagName === 'NAV' && !el.hasAttribute('role')) el.setAttribute('role', 'navigation');
    else if (el.tagName === 'MAIN' && !el.hasAttribute('role')) el.setAttribute('role', 'main');
    else if (el.tagName === 'ASIDE' && !el.hasAttribute('role')) el.setAttribute('role', 'complementary');
    else if (el.tagName === 'FOOTER' && !el.hasAttribute('role')) el.setAttribute('role', 'contentinfo');
  });
  ensureUniqueLandmarks();
}
function addAriaToFormControls() {
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(el => {
    if (!el.hasAttribute('aria-label') && !el.hasAttribute('aria-labelledby')) {
      const lbl = el.getAttribute('id') ? document.querySelector(`label[for="${el.id}"]`) : null;
      if (lbl) el.setAttribute('aria-labelledby', lbl.id);
      else {
        const fallback = el.getAttribute('placeholder') || `${el.type || 'Form control'} field`;
        el.setAttribute('aria-label', fallback);
      }
    }
  });
}

/* Screeps harvest/upgrade logic */
function harvestAndUpgradeLogic() {
  for (const creep of Game.creeps) {
    if (creep.memory.working) {
      if (creep.store.getFreeCapacity() > 0) {
        const source = creep.pos.findClosestByRange(FIND_SOURCES);
        if (source) creep.harvest(source);
      } else {
        const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: s => s.structureType === STRUCTURE_EXTENSION ||
                       s.structureType === STRUCTURE_SPAWN ||
                       s.structureType === STRUCTURE_TOWER
        });
        if (target) creep.upgradeStructure(target);
      }
    } else {
      let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if (!target) {
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) creep.attack(target);
        else creep.moveTo(Game.flags.Worker);
      } else creep.build(target);
    }
  }
}
function harvest(creep, source) {
  if (!source) return;
  if (creep.harvest(source) === ERR_NOT_IN_RANGE) creep.moveTo(source);
}
function upgradeController(creep, controller) {
  if (!controller) return;
  if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) creep.moveTo(controller);
}

/* Dependency‑graph placeholder */
function renderDependencyGraph(module) {
  console.log('Rendering dependency graph for:', module);
  const container = document.getElementById('dependencyGraph');
  if (container && !container.hasAttribute('role')) {
    container.setAttribute('role', 'region');
    container.setAttribute('aria-label', 'Dependency graph visualization');
  }
  return { module, dependencies: [], rendered: true };
}

/* -------------------------------------------------------------------------- */
/* Main entry – runs in Screeps environment                                 */
/* -------------------------------------------------------------------------- */
module.exports = function() {
  // Accessibility initialization
  const langAttr = getLangAttribute();
  const primaryContent = wrapPrimaryContentInMain();

  // Apply accessibility fixes
  validateTableAccessibility();
  validateTableStructure();
  validateLandmark();
  validateLandmarkStructure();
  addFixLandmarkIssues();

  // SVG & form fixes
  const svgName = getSvgAccessibleName();
  addAriaToFormControls();

  // Unique landmarks and fake‑link cleanup
  ensureUniqueLandmarks();
  fixFakeLinkIssues();
  createAccessibleLink();

  // Core game logic
  harvestAndUpgradeLogic();

  // Additional Screeps logic may be added here
};

/* Export app for Node runtime */
module.exports = app;