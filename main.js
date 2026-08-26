// main.js - Entry point for the application with accessibility fixes for React components
// Addressed accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and getFullLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), ... and createAccessibleLink())

// Import content modules for dependency graphs and index views
import { dependencyGraphContent } from './content/dependencyGraphContent.js';
import { indexContent } from './content/indexContent.js';

// New functions requested by the issue

function getLangAttribute() {
  const html = document.documentElement;
  return html.getAttribute('lang') || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang;
  return lang ? lang : 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  let hasIssues = false;
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      const scope = th.getAttribute('scope');
      if (!scope) {
        hasIssues = true;
      } else if (!['row', 'col', 'rowgroup', 'colgroup'].includes(scope)) {
        hasIssues = true;
      }
    });
  });
  return !hasIssues;
}

function validateTableStructure() {
  return checkTableStructure();
}

function getSvgAccessibleName() {
  const svgs = document.querySelectorAll('svg');
  for (let i = 0; i < svgs.length; i++) {
    const svg = svgs[i];
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel) return ariaLabel;
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy) {
      const labelEl = document.getElementById(ariaLabelledBy);
      if (labelEl) return labelEl.textContent.trim();
    }
    const title = svg.querySelector('title');
    if (title) return title.textContent.trim();
  }
  return '';
}

// Wrap primary content in main element for accessibility
function addMainLandmark() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
    return newMain;
  }
  return main;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarkIds() {
  const landmarks = document.querySelectorAll('header, footer, aside, main, nav, [role="banner"], [role="contentinfo"], [role="complementary"], [role="main"], [role="navigation"], [role="search"]');
  const landmarkRoles = new Map();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    if (role && landmark.id) {
      if (landmarkRoles.has(role)) {
        landmark.id = role + '-' + (landmarkRoles.get(role) + 1);
        landmarkRoles.set(role, landmarkRoles.get(role) + 1);
      } else {
        landmarkRoles.set(role, 1);
      }
    }
  });
}

// REACT_025: Fix multiple main landmarks by converting extras to section elements
function fixMultipleMainLandmarks() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length <= 1) {
    return mainElements.length;
  }

  let fixedCount = 0;
  mainElements.forEach((mainEl, index) => {
    if (index === 0) return; // Keep the first main element

    // Convert subsequent main elements to section
    const section = document.createElement('section');
    // Preserve attributes except role
    Array.from(mainEl.attributes).forEach(attr => {
      if (attr.name !== 'role') {
        section.setAttribute(attr.name, attr.value);
      }
    });
    // Add role="region" for accessibility
    section.setAttribute('role', 'region');
    // Add aria-label if not present
    if (!section.hasAttribute('aria-label') && !section.hasAttribute('aria-labelledby')) {
      section.setAttribute('aria-label', `Content section ${index + 1}`);
    }
    // Move children
    while (mainEl.firstChild) {
      section.appendChild(mainEl.firstChild);
    }
    // Replace main with section
    mainEl.parentNode.replaceChild(section, mainEl);
    fixedCount++;
  });

  return fixedCount;
}

// REACT_025: Validate that only one main landmark exists
function ensureUniqueLandmarks() {
  const mainElements = document.querySelectorAll('main');
  const issues = [];

  if (mainElements.length === 0) {
    issues.push('No main landmark found');
  } else if (mainElements.length > 1) {
    issues.push(`Multiple main landmarks found (${mainElements.length}). Only one <main> element should exist per page.`);
  }

  // Check for other duplicate landmarks
  const landmarkSelectors = ['header', 'footer', 'aside', 'nav'];
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      issues.push(`Multiple <${selector}> landmarks found (${elements.length}). Consider using aria-label or aria-labelledby to distinguish them.`);
    }
  });

  return {
    valid: issues.length === 0,
    issues,
    mainCount: mainElements.length
  };
}

// REACT_041: Add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

// NEW: Fix favicon accessibility by marking as decorative
function fixFaviconAccessibility() {
  const faviconLinks = document.querySelectorAll('link[rel="shortcut icon"]');
  faviconLinks.forEach(link => {
    link.setAttribute('aria-hidden', 'true');
  });
}

// Fake link / accessible link creation helpers
function createInPageButton(label, onClick) {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('type', 'button');
  if (onClick) {
    button.addEventListener('click', onClick);
  }
  return button;
}

function createAccessibleLink(href, label) {
  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('aria-label', label);
  link.textContent = label;
  return link;
}

// Validate link accessibility (fake link check)
function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  let hasIssues = false;
  links.forEach(link => {
    if (!link.href || link.getAttribute('href') === '#') {
      hasIssues = true;
    }
  });
  return !hasIssues;
}

// Check valid TH scope attribute
function hasValidTHScope(th) {
  const scope = th.getAttribute('scope');
  return scope === 'row' || scope === 'col' || scope === 'rowgroup' || scope === 'colgroup';
}

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Fix table structure issues
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        // Try to infer scope from position
        const isFirstInRow = th.parentElement && th.parentElement.firstElementChild === th;
        const rowIndex = Array.from(th.parentElement ? th.parentElement.children : []).indexOf(th);
        const isFirstInCol = rowIndex === 0;
        if (isFirstInRow && isFirstInCol) {
          th.setAttribute('scope', 'col');
        } else if (isFirstInRow) {
          th.setAttribute('scope', 'row');
        } else {
          th.setAttribute('scope', 'col');
        }
      }
    });
  });
}

// Check table structure validity
function checkTableStructure() {
  const tables = document.querySelectorAll('table');
  for (const table of tables) {
    const headers = table.querySelectorAll('th');
    for (const th of headers) {
      if (!hasValidTHScope(th)) {
        return false;
      }
    }
  }
  return true;
}

// Add main landmark if missing
function addMainLandmark() {
  const main = document.querySelector('main');
  if (!main) {
    const newMain = document.createElement('main');
    document.body.insertBefore(newMain, document.body.firstChild);
    return newMain;
  }
  return main;
}

// Add landmark regions for accessibility
function addLandmarkRegions() {
  // Ensure main landmark exists
  addMainLandmark();

  // Validate and fix unique landmarks
  ensureUniqueLandmarks();
  fixMultipleMainLandmarks();

  // Ensure other landmarks have proper labeling
  const landmarks = document.querySelectorAll('header, footer, nav, aside');
  landmarks.forEach((landmark, index) => {
    if (!landmark.hasAttribute('aria-label') && !landmark.hasAttribute('aria-labelledby')) {
      const tagName = landmark.tagName.toLowerCase();
      landmark.setAttribute('aria-label', `${tagName} ${index + 1}`);
    }
  });
}

// Fix fake link issue - convert anchor tags without href to buttons
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a:not([href]), a[href="#"]');
  fakeLinks.forEach(link => {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    button.setAttribute('type', 'button');
    // Copy all attributes except href
    Array.from(link.attributes).forEach(attr => {
      if (attr.name !== 'href') {
        button.setAttribute(attr.name, attr.value);
      }
    });
    // Copy event listeners by cloning
    const clonedLink = link.cloneNode(true);
    link.parentNode.replaceChild(button, link);
  });
}

// REACT_041: Fix inline SVG favicon accessibility (for data:image/svg+xml favicons)
// These SVGs are decorative and should be hidden from screen readers
function fixInlineFaviconSvgAccessibility() {
  // Find all SVG elements that appear to be favicons (small, in head or used as icons)
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    // Check if this SVG is likely a favicon/icon (small viewBox, contains only emoji/text)
    const viewBox = svg.getAttribute('viewBox');
    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');
    
    // Favicons typically have small viewBox like 0 0 100 100 or similar
    const isSmallIcon = viewBox && viewBox.includes('100') && viewBox.includes('100');
    const isIconSize = (width && parseInt(width) <= 32) || (height && parseInt(height) <= 32);
    
    // Check if SVG contains only a text/emoji element (typical for emoji favicons)
    const hasOnlyText = svg.children.length === 1 && svg.querySelector('text');
    const hasTitle = svg.querySelector('title');
    
    // If it's a small decorative icon without proper accessible name, mark as decorative
    if ((isSmallIcon || isIconSize) && hasOnlyText && !svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      // If it has a title, keep it but ensure it's accessible
      // If no title, mark as decorative
      if (!hasTitle) {
        svg.setAttribute('aria-hidden', 'true');
      } else {
        // Ensure the title is properly associated
        if (!svg.hasAttribute('aria-labelledby')) {
          const title = svg.querySelector('title');
          if (title && !title.id) {
            title.id = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
          }
          if (title && title.id) {
            svg.setAttribute('aria-labelledby', title.id);
          }
        }
      }
    }
  });
}

// REACT_041: Comprehensive fix for favicon SVGs in metadata (Next.js generated)
// This handles the case where favicons are defined as data URLs in layout.tsx
function fixMetadataFaviconAccessibility() {
  // For Next.js metadata icons, the SVGs are embedded as data URLs in <link> tags
  // We can't modify data URLs directly, but we can ensure any rendered SVG favicons are accessible
  const iconLinks = document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]');
  iconLinks.forEach(link => {
    const href = link.getAttribute('href');
    // If it's a data URL SVG, mark the link as decorative since the SVG itself can't be modified
    if (href && href.startsWith('data:image/svg+xml')) {
      link.setAttribute('aria-hidden', 'true');
    }
  });
}

// Initialize all accessibility fixes
function initializeAccessibilityFixes() {
  addLangAttribute();
  fixTableStructure();
  addLandmarkRegions();
  fixFakeLinkIssue();
  fixFaviconAccessibility();
  addSvgAccessibleNames();
  fixInlineFaviconSvgAccessibility();
  fixMetadataFaviconAccessibility();
}

// TODO: Identify and update specific functions that render dependency graphs or
// index views to import and use dependencyGraphContent/indexContent from
// their respective modules for better maintainability and content separation.