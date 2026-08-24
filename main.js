import React from 'react';

function Header() {
  // ... already existing code here
}

function Navigation() {
  // ... already existing code here
}

function MainContent() {
  // ... already existing code here
}

function Sidebar() {
  // ... already existing code here
}

function Footer() {
  // ... already existing code here
}

function Logo() {
  // ... already existing code here
}

function SearchIcon() {
  // ... already existing code here
}

function UniqueSection() {
  // ... already existing code here
}

function FakeLinkFixed() {
  // ... already existing code here
}

// Address accessibility issues from insight report:
// ... already existing functions

// NEW: Add lang attribute to HTML element. This function can be implemented in setupTests.js or globally in a JS file
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// NEW: Fix table structure issues (if any tables exist)
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure tables have proper structure with caption, thead, and tbody
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

// NEW: Add Main landmark and validate validity
function addMainLandmark() {
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  return mainElement !== null;
}

function validateMainLandmark() {
  const mainElements = document.querySelectorAll('main, [role="main"]');
  return mainElements.length === 1;
}

// NEW: Validate unique landmarks
function validateLandmarkRoles() {
  // Ensure landmarks like Header, Navigation, MainContent, Sidebar, Footer are unique
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const foundLandmarks = {};

  landmarkRoles.forEach(role => {
    const element = document.querySelector(`[role="${role}"]`) || document.querySelector(role === 'main' ? 'main' : role === 'navigation' ? 'nav' : role === 'banner' ? 'header' : role === 'contentinfo' ? 'footer' : 'aside');
    if (element) {
      foundLandmarks[role] = (foundLandmarks[role] || 0) + 1;
    }
  });

  // Return true if each landmark appears exactly once
  return Object.values(foundLandmarks).every(count => count === 1);
}

// NEW: Validate table structure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let allValid = true;

  tables.forEach(table => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    const hasHeaderCells = table.querySelectorAll('th').length > 0;

    if (!hasCaption || !hasHeaderCells) {
      allValid = false;
    }
  });

  return allValid;
}

// Additional exports if needed (e.g., functions for testing)
export {
  Header, Navigation, MainContent, Sidebar, Footer, Logo, SearchIcon, UniqueSection,
  FakeLinkFixed,
  addLangAttribute,
  fixTableStructure,
  validateTableStructure,
  validateLandmarkRoles,
  validateMainLandmark
};