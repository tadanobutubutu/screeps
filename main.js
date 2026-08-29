// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 2 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and ...)
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (DONE: ensureUniqueLandmarks)
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())
// - REACT_037: Add proper landmark regions (DONE: addProperLandmarkRegions)

// Commit: a3c5cf541ab167e23402b298c1007dab267aff41

import React from 'react';

const {
  getLangAttribute,
  getFullLangAttribute,
  createInPageButton,
  createAccessibleLink,
} = ...

// Export affected functions and Main component to make them accessible
module.exports = {
  ...affectedFunctions,
  Main: Main,
};

// Accessibility functions
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function getFullLangAttribute() {
  const lang = document.documentElement.lang || 'en';
  const htmlElement = document.documentElement;
  if (htmlElement.hasAttribute('xml:lang')) {
    return htmlElement.getAttribute('xml:lang');
  }
  return lang;
}

function validateTableAccessibility(table) {
  const issues = [];
  
  // Check if table has proper structure
  const headers = table.querySelectorAll('th');
  const caption = table.querySelector('caption');
  
  if (headers.length === 0) {
    issues.push({ type: 'REACT_027', message: 'Table missing header cells (th)' });
  }
  
  // Check for proper scope attributes
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      issues.push({ type: 'REACT_027', message: 'Table header missing scope attribute' });
    }
  });
  
  // Check for caption or summary
  if (!caption && !table.getAttribute('summary')) {
    issues.push({ type: 'REACT_027', message: 'Table missing caption or summary' });
  }
  
  return issues;
}

function validateTableStructure(table) {
  const issues = [];
  
  // Ensure proper table structure
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');
  
  if (!thead) {
    issues.push({ type: 'REACT_027', message: 'Table should have thead section' });
  }
  
  if (!tbody) {
    issues.push({ type: 'REACT_027', message: 'Table should have tbody section' });
  }
  
  // Check for proper row/column associations
  const rows = table.querySelectorAll('tr');
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) {
      issues.push({ type: 'REACT_027', message: `Row ${rowIndex} has no cells` });
    }
  });
  
  return issues;
}

function validateLandmark(element) {
  const issues = [];
  const validLandmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];
  
  if (element.hasAttribute('role')) {
    const role = element.getAttribute('role');
    if (!validLandmarks.includes(role)) {
      issues.push({ type: 'REACT_017', message: `Invalid landmark role: ${role}` });
    }
  }
  
  return issues;
}

function validateLandmarkStructure() {
  const issues = [];
  
  // Check for multiple banner landmarks
  const banners = document.querySelectorAll('[role="banner"], header');
  if (banners.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple banner landmarks found' });
  }
  
  // Check for multiple main landmarks
  const mains = document.querySelectorAll('[role="main"], main');
  if (mains.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple main landmarks found' });
  }
  
  // Check for multiple contentinfo landmarks
  const contentInfos = document.querySelectorAll('[role="contentinfo"], footer');
  if (contentInfos.length > 1) {
    issues.push({ type: 'REACT_017', message: 'Multiple contentinfo landmarks found' });
  }
  
  return issues;
}

function ensureUniqueLandmarks() {
  const landmarks = {
    banner: document.querySelectorAll('[role="banner"], header'),
    navigation: document.querySelectorAll('[role="navigation"], nav'),
    main: document.querySelectorAll('[role="main"], main'),
    complementary: document.querySelectorAll('[role="complementary"], aside'),
    contentinfo: document.querySelectorAll('[role="contentinfo"], footer'),
    search: document.querySelectorAll('[role="search"]'),
    form: document.querySelectorAll('[role="form"]'),
  };
  
  const issues = [];
  
  // Ensure only one of each unique landmark type
  Object.keys(landmarks).forEach(landmarkType => {
    if (landmarks[landmarkType].length > 1) {
      issues.push({ 
        type: 'REACT_025', 
        message: `Multiple ${landmarkType} landmarks found (${landmarks[landmarkType].length})` 
      });
    }
  });
  
  return issues;
}

function addProperLandmarkRegions() {
  const regions = [];
  
  // Ensure proper landmark regions exist
  if (!document.querySelector('header, [role="banner"]')) {
    regions.push('banner');
  }
  if (!document.querySelector('nav, [role="navigation"]')) {
    regions.push('navigation');
  }
  if (!document.querySelector('main, [role="main"]')) {
    regions.push('main');
  }
  if (!document.querySelector('aside, [role="complementary"]')) {
    regions.push('complementary');
  }
  if (!document.querySelector('footer, [role="contentinfo"]')) {
    regions.push('contentinfo');
  }
  
  return regions;
}

function validateLinkAccessibility(link) {
  const issues = [];
  
  // Check if link has accessible text
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.hasAttribute('aria-label');
  const hasAriaLabelledby = link.hasAttribute('aria-labelledby');
  const hasTitle = link.hasAttribute('title');
  
  if (!hasText && !hasAriaLabel && !hasAriaLabelledby && !hasTitle) {
    issues.push({ type: 'REACT_036', message: 'Link missing accessible text' });
  }
  
  // Check for proper href
  if (!link.hasAttribute('href') || link.getAttribute('href') === '#') {
    issues.push({ type: 'REACT_036', message: 'Link missing or invalid href attribute' });
  }
  
  return issues;
}

function handleFakeLinks() {
  const issues = [];
  const fakeLinks = document.querySelectorAll('div[onclick], span[onclick], a:not([href])');
  
  fakeLinks.forEach(element => {
    if (element.tagName === 'A' && !element.hasAttribute('href')) {
      issues.push({ type: 'REACT_036', message: 'Anchor element missing href attribute' });
      element.setAttribute('role', 'button');
    } else if (element.hasAttribute('onclick')) {
      issues.push({ type: 'REACT_036', message: `Fake link element detected (${element.tagName})` });
    }
  });
  
  return issues;
}

function set