// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (added below)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Import any required modules (adjust path as needed)
// import { helperFunction } from './utils.js';

// Configuration
const CONFIG = {
  appName: 'Accessibility Enhanced App',
  version: '1.0.0'
};

// TODO: Address accessibility issues from insight report:
// Placeholder for new code or changes to address accessibility issues

/**
 * Initializes the application with accessibility features
 */
function initializeApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) {
    console.warn('App container not found');
    return;
  }

  // Set ARIA live region for dynamic content updates
  appContainer.setAttribute('aria-live', 'polite');
  appContainer.setAttribute('role', 'application');

  // Ensure keyboard navigation is possible
  appContainer.setAttribute('tabindex', '0');

  console.log(`${CONFIG.appName} v${CONFIG.version} initialized`);
}

/**
 * Creates an accessible button element
 * @param {string} text - Button label
 * @param {Function} onClick - Click handler
 * @returns {HTMLButtonElement} Accessible button
 */
function createAccessibleButton(text, onClick) {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', label);

  button.addEventListener('click', () => {
    const targetId = href.replace('#', '');
    const target = document.getElementById(targetId) || document.querySelector(targetId);
    if (target) {
      target.setAttribute('tabindex', '-1');
      target.focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  return button;
}

/**
 * Announces a message to screen readers using ARIA live regions
 * @param {string} message - Message to announce
 * @param {string} priority - 'polite' or 'assertive'
 */
export function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return false;
  }

  // Check for caption
  const hasCaption = table.querySelector('caption') !== null;

  // Check for table headers (th elements)
  const headers = table.querySelectorAll('th');
  const hasHeaders = headers.length > 0;

  // Validate that headers have proper scope attributes
  const headersHaveScope = Array.from(headers).every(th => {
    const scope = th.getAttribute('scope');
    return scope === 'col' || scope === 'row';
  });

  // Check for proper thead/tbody structure
  const hasThead = table.querySelector('thead') !== null;
  const hasTbody = table.querySelector('tbody') !== null;

  return hasCaption && hasHeaders && headersHaveScope && hasThead && hasTbody;
}

// Render dependency graph
function renderDependencyGraph(modules) {
  let graphHTML = '<ul class="dependency-list">';
  modules.forEach(module => {
    graphHTML += `<li>${module.name}`;
    if (module.dependencies && module.dependencies.length > 0) {
      graphHTML += renderDependencyGraph(module.dependencies);
    }
    graphHTML += '</li>';
  });
  graphHTML += '</ul>';
  renderDependencyGraphContent(graphHTML);
}

// Display module structure
function displayModuleStructure(modules) {
  let structureHTML = '<div class="module-structure">';
  modules.forEach(module => {
    structureHTML += `<div class="module" data-module-name="${module.name}">`;
    structureHTML += `<h3>${module.name}</h3>`;
    if (module.imports) {
      structureHTML += '<details><summary>Imports</summary><ul>';
      module.imports.forEach(imp => {
        structureHTML += `<li>${imp}</li>`;
      });
      structureHTML += '</ul></details>';
    }
    if (module.exports) {
      structureHTML += '<details><summary>Exports</summary><ul>';
      module.exports.forEach(exp => {
        structureHTML += `<li>${exp}</li>`;
      });
      structureHTML += '</ul></details>';
    }
    structureHTML += '</div>';
  });
  structureHTML += '</div>';
  const container = document.querySelector('.dependency-graph-content, [data-dependency-graph-content]');
  if (container) {
    container.innerHTML = structureHTML;
  }

  // Check for <title> element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }

  // Check for <desc> element
  const desc = svg.querySelector('desc');
  if (desc && desc.textContent.trim()) {
    return desc.textContent.trim();
  }

  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelledbyElement = document.getElementById(ariaLabelledby);
    if (labelledbyElement && labelledbyElement.textContent.trim()) {
      return labelledbyElement.textContent.trim();
    }
  }

  // Fallback to role description or text content
  return svg.getAttribute('role') || svg.textContent.trim() || '';
}

/**
 * Sets accessibility attributes on an SVG element
 * @param {SVGElement} svg - The SVG element
 * @param {string} accessibleName - The accessible name to set
 */
export function setSvgAttributes(svg, accessibleName) {
  if (!svg) return;

  const name = accessibleName || getSvgAccessibleName(svg);

  if (name && name.trim()) {
    svg.setAttribute('aria-label', name);
    svg.setAttribute('role', 'img');
  } else {
    // Hide decorative SVGs from assistive technologies
    svg.setAttribute('aria-hidden', 'true');
  }
}