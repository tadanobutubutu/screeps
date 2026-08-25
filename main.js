import React from 'react';
import ReactDOM from 'react-dom';
import { createIcon } from './iconCreator';

// Add lang attribute to HTML element
function addLangAttribute() {
  const html = document.documentElement;
  if (!html.hasAttribute('lang')) {
    html.setAttribute('lang', 'en');
  }
}

// Placeholder icons object for exports
const icons = {};

// Helper functions to render accessible SVG and landmark structure
const renderAccessibleSVG = (id, title, children) => (
  <svg aria-labelledby={id} role="img" width="100" height="100">
    <title id={id}>{title}</title>
    {children}
  </svg>
);

// Function to create and render landmark regions for accessibility
const renderLandmarkRegions = () => (
  <aside aria-label="Landmarks">
    <article aria-labelledby="group-region-label" role="region" id="group-region">
      <h3 id="group-region-label">Group Region</h3>
      {/* Render specific landmark groups and regions here */}
    </article>
    <article aria-labelledby="contact-region-label" role="region" id="contact-region">
      <h3 id="contact-region-label">Contact Region</h3>
      {/* Render specific landmark contact details here */}
    </article>
  </aside>
);

// ... (existing exports)

// Add the new export for the renderLandmarkRegions function
export {
  icons,
  renderAccessibleSVG,
  renderLandmarkStructure,
  generateRotateBackControl,
  setupRotateBack,
  createIconForTest,
  createIcon,
  App,
  renderLandmarkRegions,
};

// Helper functions to address accessibility issues (merged from both versions)
const fixTableStructure = () => {
  const table = document.querySelector('table');
  if (table) {
    normalizeTableHeaderCellScope(table);
  }
};

const normalizeTableHeaderCellScope = (table) => {
  const rows = table.querySelectorAll('tr');

  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');

    cells.forEach((cell, cellIndex) => {
      if (cell.tagName === 'TH') {
        if (cellIndex === 0) {
          cell.setAttribute('scope', 'row');
        } else {
          cell.setAttribute('scope', 'col');
        }
      }
    });
  });
};

// Function to add landmark roles to the page (merged from both versions)
const addMainLandmark = () => {
  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }
};

// Validation functions for landmarks and links
const validateLandmark = () => {
  const main = document.querySelector('main, [role="main"]');
  if (!main) {
    console.warn('Warning: No main landmark found on the page');
  }
};

const validateLinkAccessibility = () => {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasTitle = link.hasAttribute('title');

    if (!hasText && !hasAriaLabel && !hasTitle) {
      console.warn('Warning: Link missing accessible text content');
    }
  });
};

// Functions to ensure unique landmark roles (merged from both versions)
const ensureUniqueLandmarks = () => {
  const landmarks = document.querySelectorAll('[role="banner"], [role="navigation"], [role="main"], [role="contentinfo"]');
  const seenTypes = {};

  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seenTypes[role]) {
      landmark.removeAttribute('role');
    } else {
      seenTypes[role] = true;
    }
  });
};

const ensureUniqueLandmarkRoles = () => {
  const allLandmarks = document.querySelectorAll('[role]');
  const roleCount = {};

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    roleCount[role] = (roleCount[role] || 0) + 1;
  });

  for (const role in roleCount) {
    if (roleCount[role] > 1) {
      console.warn(`Warning: Multiple landmarks with role="${role}" found`);
    }
  }
};

// Function to fix fake link issues (merged from both versions)
const fixFakeLinkIssue = () => {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === '#' || href === '' || href === 'javascript:void(0)') {
      link.setAttribute('role', 'button');
    }
  });
};

// Example usage of the accessibility functions
document.addEventListener('DOMContentLoaded', () => {
  accessibilityModule.init();
  renderLandmarkRegions(); // Add this new call to renderLandmarkRegions function
});

// Add the new function at the end
function addressAccessibilityIssues() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
  validateLandmark();
  ensureUniqueLandmarks();
  ensureUniqueLandmarkRoles();
  fixFakeLinkIssue();
  validateLinkAccessibility();
  createInPageButton();
  createAccessibleLink();
}

// Address accessibility issues from the insight report
addressAccessibilityIssues();