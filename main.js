import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from ...
import a11y from './AccessibilityUtilities'; // Assuming accessibility utilities are in a separate file

const root = ...

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// Ensure the dependencyGraph container has a proper ARIA role
// (This comment remains as-is)
//_Commit: eef4b6be04a5e2cd61b75c43cfe2dff2da0857ca2_
//<!-- todo-hash: 4798ccecb0ac0a8c0f11ea9eebbacc3bee5d9b2 -->
//_Commit: f8051b788bad4952d8493f08d3c7d22a06ff80d3_
//<!-- todo-hash: b498b47abee4b3f29c69a9762237d968a50cc419 -->
//_Commit: 5cb26805d1cf9dc1c3c0bd9f2923ab16e34f825e _
//<!-- todo-hash: c87b573b0860b150bcfdfdff7be68c9f7779afde -->

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and addLangAttribute())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility(), validateTableStructure() and fixTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by addMainLandmark(), validateLandmark(), validateLandmarkStructure() and ...
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.

/**
 * Gets the lang attribute for the HTML element
 * @returns {string} The lang attribute value
 */
export function getLangAttribute() {
  const htmlElement = document.documentElement;
  return htmlElement.getAttribute('lang') || 'en';
}

/**
 * Adds lang attribute to HTML element
 */
export function addLangAttribute() {
  const htmlElement = document.documentElement;
  if (!htmlElement.getAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Validates table accessibility
 * @param {HTMLElement} table - The table element to validate
 * @returns {boolean} True if table is accessible
 */
export function validateTableAccessibility(table) {
  if (!table) return false;
  
  const hasCaption = table.querySelector('caption') !== null;
  const hasHeaderCells = table.querySelectorAll('th').length > 0;
  const hasProperScope = Array.from(table.querySelectorAll('th')).every(
    th => th.hasAttribute('scope')
  );
  
  return hasCaption && hasHeaderCells && hasProperScope;
}

/**
 * Validates table structure
 */
export function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const issues = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    const headerCells = table.querySelectorAll('th');
    
    if (headerCells.length === 0) {
      issues.push(`Table ${index + 1}: Missing header cells`);
    }
    
    if (!table.querySelector('caption')) {
      issues.push(`Table ${index + 1}: Missing caption`);
    }
  });
  
  return issues;
}

/**
 * Fixes table structure issues
 */
export function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  
  tables.forEach((table) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Data table';
      table.insertBefore(caption, table.firstChild);
    }
    
    // Add scope attributes to header cells
    const headerCells = table.querySelectorAll('th');
    headerCells.forEach(th => {
      if (!th.hasAttribute('scope')) {
        const row = th.parentElement;
        const isHeaderRow = Array.from(row.children).every(cell => cell.tagName === 'TH');
        th.setAttribute('scope', isHeaderRow ? 'row' : 'col');
      }
    });
  });
}

/**
 * Adds main landmark to page
 */
export function addMainLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    document.body.insertBefore(main, document.body.firstChild);
  }
}

/**
 * Validates landmark accessibility
 */
export function validateLandmark() {
  const landmarks = {
    header: document.querySelector('header'),
    nav: document.querySelector('nav'),
    main: document.querySelector('main'),
    footer: document.querySelector('footer'),
    aside: document.querySelector('aside')
  };
  
  return Object.entries(landmarks).filter(([_, element]) => element !== null).length > 0;
}

/**
 * Validates landmark structure
 */
export function validateLandmarkStructure() {
  const issues = [];
  
  const headers = document.querySelectorAll('header');
  if (headers.length > 1) {
    const nonNavHeaders = Array.from(headers).filter(h => !h.querySelector('nav'));
    if (nonNavHeaders.length > 1) {
      issues.push('Multiple header landmarks without nav elements');
    }
  }
  
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    issues.push('Multiple main landmarks found');
  }
  
  return issues;
}

/**
 * Validates landmark attributes
 */
export function validateLandmarkAttributes() {
  const landmarks = document.querySelectorAll('[role], header, nav, main, footer, aside');
  const issues = [];
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    const tagName = landmark.tagName.toLowerCase();
    
    if (role && ['banner', 'navigation', 'main', 'contentinfo', 'complementary'].includes(role)) {
      if (tagName !== roleToTag(role)) {
        issues.push(`Landmark with role="${role}" should be a <${roleToTag(role)}> element`);
      }
    }
  });
  
  return issues;
}

/**
 * Helper function to map ARIA roles to semantic HTML tags
 * @param {string} role - The ARIA role
 * @returns {string} The corresponding HTML tag name
 */
function roleToTag(role) {
  const roleMap = {
    'banner': 'header',
    'navigation': 'nav',
    'main': 'main',
    'contentinfo': 'footer',
    'complementary': 'aside'
  };
  return roleMap[role] || 'div';
}

/**
 * Gets SVG accessible name
 * @returns {string} The accessible name for SVG element
 */
export function getSvgAccessibleName() {
  return 'Decorative or functional graphic';
}

/**
 * Sets SVG attributes for accessibility
 */
export function setSvgAttributes() {
  const svgs = document.querySelectorAll('svg');
  
  svgs.forEach(svg => {
    const role = svg.getAttribute('role');
    const ariaLabel = svg.getAttribute('aria-label');
    const ariaLabelledby = svg.getAttribute('aria-labelledby');
    
    if (!role) {
      svg.setAttribute('role', 'img');
    }
    
    if (!ariaLabel && !ariaLabelledby) {
      const title = svg.querySelector('title');
      if (title) {
        const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
        title.id = titleId;
        svg.setAttribute('aria-labelledby', titleId);
      } else {
        svg.setAttribute('aria-label', getSvgAccessibleName());
      }
    }
  });
}

/**
 * Ensures unique landmarks on the page
 */
export function ensureUniqueLandmarks() {
  const landmarkSelectors = ['header', 'main', 'footer', 'nav', 'aside'];
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    if (elements.length > 1) {
      elements.forEach((el, index) => {
        if (index > 0) {
          el.removeAttribute(selector);
          el.setAttribute('role', selector === 'header' ? 'banner' : selector);
        }
      });
    }
  });
}

/**
 * Creates an in-page navigation button
 */
export function createInPageButton() {
  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.setAttribute('aria-label', 'Navigate to section');
  return button;
}

/**
 * Validates link accessibility
 */
export function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  const issues = [];
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
    const hasTitle = link.hasAttribute('title');
    
    if (!href || href === '#' || href === 'javascript:void(0)') {
      if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
        issues.push(`Link at index ${index}: Fake link without accessible name`);
      }
    }
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
      issues.push(`Link at index ${index}: No accessible name`);
    }
  });
  
  return issues;
}

/**
 * Handles fake links on the page
 */
export function handleFakeLinks() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href="javascript:void(0)"], a[href=""]');
  
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        link.click();
      }
    });
  });
}

/**
 * Adds proper landmark regions to the page
 */
export function addProperLandmarkRegions() {
  const regions = document.querySelectorAll('[role="region"]');
  
  regions.forEach(region => {
    const ariaLabel = region.getAttribute('aria-label');
    const ariaLabelledby = region.getAttribute('aria-labelledby');
    
    if (!ariaLabel && !ariaLabelledby) {
      const heading = region.querySelector('h1, h2, h3, h4, h5, h6');
      if (heading) {
        const headingId = `region-heading-${Math.random().toString(36).substr(2, 9)}`;
        heading.id = headingId;
        region.setAttribute('aria-labelledby', headingId);
      }
    }
  });
}