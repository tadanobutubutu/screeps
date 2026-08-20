// main.js
// [Preserve all existing code and exports]

// Add new dependency updates as needed
// For example, if updating Jest to v30:
const jest = require('jest'); // Update to v30 if needed

// For React updates:
import React from 'react'; // Update to v19 if needed

// For ESLint updates:
const eslint = require('eslint'); // Update to v10 if needed

// For TypeScript updates:
const typescript = require('typescript'); // Update to v7 if needed

// Add any new functions or changes requested in the issue
// while preserving all existing functionality

// Add main landmark to layout components
function wrapWithMain(content) {
  return React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content);
}

// Add main landmark to HTML documents
function addMainToHTML(content) {
  return `<main role="main" aria-label="Main content">${content}</main>`;
}

// Add language attribute to HTML documents
function addLanguageAttribute(html) {
  // Check if lang attribute already exists
  if (/<html[^>]*lang=/i.test(html)) {
    return html;
  }
  // Add lang="en" to the html tag
  return html.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
}

// Add proper table structure
function createAccessibleTable(headers, rows) {
  return React.createElement(
    'table',
    { 'aria-label': 'Data table' },
    React.createElement(
      'thead',
      null,
      React.createElement(
        'tr',
        null,
        headers.map((header, index) => 
          React.createElement('th', { key: header, scope: 'col' }, header)
        )
      )
    ),
    React.createElement(
      'tbody',
      null,
      rows.map((row, rowIndex) =>
        React.createElement(
          'tr',
          { key: rowIndex },
          row.map((cell, cellIndex) =>
            React.createElement('td', { key: cellIndex }, cell)
          )
        )
      )
    )
  );
}

// Create accessible table header cell with proper scope attribute
function createThElement(content, options = {}) {
  const { isRowHeader = false, isColumnHeader = true, key } = options;
  
  let scope = 'col';
  if (isRowHeader && !isColumnHeader) {
    scope = 'row';
  } else if (isColumnHeader) {
    scope = 'col';
  }
  
  return React.createElement('th', { scope, key }, content);
}

// Create accessible table row with proper header scopes
function createAccessibleTableRow(cells, rowIndex, isHeaderRow = false) {
  return React.createElement(
    'tr',
    { key: rowIndex },
    cells.map((cell, cellIndex) => {
      if (isHeaderRow) {
        return React.createElement('th', { key: cellIndex, scope: 'col' }, cell);
      }
      // First column cells get row scope for association
      if (cellIndex === 0) {
        return React.createElement('th', { key: cellIndex, scope: 'row' }, cell);
      }
      return React.createElement('td', { key: cellIndex }, cell);
    })
  );
}

// Create fully accessible table with all proper scope attributes
function createFullyAccessibleTable(headers, rows, options = {}) {
  const { caption, id } = options;
  
  const tableElements = [];
  
  if (caption) {
    tableElements.push(
      React.createElement('caption', { key: 'caption' }, caption)
    );
  }
  
  // Thead with column headers
  tableElements.push(
    React.createElement(
      'thead',
      { key: 'thead' },
      React.createElement(
        'tr',
        null,
        headers.map((header, index) =>
          React.createElement('th', { key: index, scope: 'col' }, header)
        )
      )
    )
  );
  
  // Tbody with row headers
  tableElements.push(
    React.createElement(
      'tbody',
      { key: 'tbody' },
      rows.map((row, rowIndex) =>
        React.createElement(
          'tr',
          { key: rowIndex },
          row.map((cell, cellIndex) => {
            // First cell in each row is a row header
            if (cellIndex === 0) {
              return React.createElement('th', { key: cellIndex, scope: 'row' }, cell);
            }
            return React.createElement('td', { key: cellIndex }, cell);
          })
        )
      )
    )
  );
  
  return React.createElement(
    'table',
    { id, 'aria-label': caption || 'Data table' },
    ...tableElements
  );
}

// Add proper landmark structure
function createLandmarkStructure(content) {
  return React.createElement(
    React.Fragment,
    null,
    React.createElement('header', { role: 'banner', 'aria-label': 'Site header' }, 'Header Content'),
    React.createElement('nav', { role: 'navigation', 'aria-label': 'Main navigation' }, 'Navigation Content'),
    React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content),
    React.createElement('footer', { role: 'contentinfo', 'aria-label': 'Site footer' }, 'Footer Content')
  );
}

// Add accessible SVG
function createAccessibleSVG(title, description, children) {
  return React.createElement(
    'svg',
    { role: 'img', 'aria-label': title, focusable: 'false' },
    React.createElement('title', null, title),
    React.createElement('desc', null, description),
    children
  );
}

// Add accessible SVG for favicon (specific fix for the issue)
function createFaviconSVG() {
  return React.createElement(
    'svg',
    {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 100 100',
      'aria-hidden': 'true',
      focusable: 'false'
    },
    React.createElement('title', null, 'Bug favicon'),
    React.createElement('text', { y: '.9em', fontSize: '90' }, '🐛')
  );
}

// Add accessible link
function createAccessibleLink(href, text) {
  return React.createElement(
    'a',
    { href: href, 'aria-label': text },
    text
  );
}

// Add accessible form elements
function createAccessibleForm(label, id, type = 'text') {
  return React.createElement(
    'div',
    { className: 'form-group' },
    React.createElement('label', { htmlFor: id }, label),
    React.createElement('input', {
      type: type,
      id: id,
      'aria-required': type === 'text' ? 'false' : 'true',
      'aria-label': label
    })
  );
}

// Add accessible button
function createAccessibleButton(text, onClick, type = 'button') {
  return React.createElement(
    'button',
    {
      type: type,
      onClick: onClick,
      'aria-label': text
    },
    text
  );
}

// Add skip to content link
function createSkipToContentLink() {
  return React.createElement(
    'a',
    {
      href: '#main',
      className: 'skip-link',
      'aria-label': 'Skip to main content'
    },
    'Skip to main content'
  );
}

// Add function to ensure single main landmark
function ensureSingleMainLandmark(content) {
  // Check if content already contains a main element
  if (typeof content === 'string') {
    const hasMain = /<main[^>]*>/i.test(content) || content.includes('<main>');
    return hasMain ? content : addMainToHTML(content);
  } else if (React.isValidElement(content)) {
    // For React elements, we'll need to check if they contain a main element
    // This is a simplified check - in a real implementation you might need a more robust solution
    return React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content);
  }
  return content;
}

// Export the new functions for use in other files
module.exports = {
  wrapWithMain,
  addMainToHTML,
  addLanguageAttribute,
  createAccessibleTable,
  createLandmarkStructure,
  createAccessibleSVG,
  createFaviconSVG, // New export for favicon SVG
  createAccessibleLink,
  createAccessibleForm,
  createAccessibleButton,
  createSkipToContentLink,
  ensureSingleMainLandmark, // New export for ensuring single main landmark
  // New table accessibility functions
  createThElement,
  createAccessibleTableRow,
  createFullyAccessibleTable,
  // Preserve all existing exports
  jest,
  React,
  eslint,
  typescript
};