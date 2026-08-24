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
  // Ensure tables have proper structure
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check if table has a thead
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const newFirstRow = firstRow.cloneNode(true);
        thead.appendChild(newFirstRow);
        table.insertBefore(thead, table.firstChild);
        firstRow.parentNode.removeChild(firstRow);
      }
    }
    // Ensure tables have a tbody
    if (!table.querySelector('tbody')) {
      const rows = Array.from(table.querySelectorAll('tr'));
      const tbody = document.createElement('tbody');
      rows.forEach(row => {
        if (row.parentNode === table) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  });
}

// NEW: Add Main landmark and validate validity
function addMainLandmark() {
  const mainElement = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainElement && !mainElement.id) {
    mainElement.id = 'main-content';
  }
}

// NEW: Validate main landmark
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
    const elements = document.querySelectorAll(`[role="${role}"], ${role === 'main' ? 'main' : role === 'banner' ? 'header' : role === 'contentinfo' ? 'footer' : role}`);
    if (elements.length > 0) {
      foundLandmarks[role] = (foundLandmarks[role] || 0) + elements.length;
    }
  });

  // Return true if each landmark appears exactly once
  return Object.values(foundLandmarks).every(count => count === 1);
}

// NEW: Validate table structure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  let isValid = true;
  
  tables.forEach(table => {
    const hasThead = table.querySelector('thead') !== null;
    const hasTbody = table.querySelector('tbody') !== null;
    
    if (!hasThead || !hasTbody) {
      isValid = false;
    }
  });
  
  return isValid;
}

// Additional exports if needed (e. g., functions for testing)
export {
  Header, Navigation, MainContent, Sidebar, Footer, Logo, SearchIcon, UniqueSection,
  FakeLinkFixed,
  addLangAttribute,
  fixTableStructure,
  validateTableStructure,
  validateLandmarkRoles,
  validateMainLandmark
};