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
  if (/<html[^>]*lang=["'][^"']*["']/i.test(html)) {
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
        headers.map(header => React.createElement('th', { key: header, scope: 'col' }, header))
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
    const hasMain = /<main[\s\S]*?>[\s\S]*?<\/main>/i.test(content);
    return hasMain ? content : addMainToHTML(content);
  } else if (React.isValidElement(content)) {
    // For React elements, we'll need to check if they contain a main element
    // This is a simplified check - in a real implementation you might need a more robust solution
    return React.createElement('main', { role: 'main', 'aria-label': 'Main content' }, content);
  }
  return content;
}

// NEW: Generate a unique ID for landmarks
function generateUniqueLandmarkId(prefix = 'landmark') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// NEW: Add unique IDs to landmark elements to satisfy uniqueness rule
function addUniqueIdsToReactElement(element) {
  if (!React.isValidElement(element)) return element;
  const { type, props, children } = element;
  // Define landmark roles that need unique IDs
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  const newProps = { ...props };
  if (type && typeof type === 'string' && landmarkRoles.includes(type.toLowerCase())) {
    if (!newProps.id) {
      newProps.id = generateUniqueLandmarkId();
    }
  }
  // Process children recursively
  if (Array.isArray(children)) {
    const newChildren = children.map(addUniqueIdsToReactElement);
    return React.createElement(type, newProps, newChildren);
  } else if (children && typeof children === 'object') {
    const newChildren = React.cloneElement(children, {}, addUniqueIdsToReactElement(children));
    return React.createElement(type, newProps, newChildren);
  }
  return React.createElement(type, newProps, children);
}

// NEW: Helper to ensure a React node has unique landmark IDs
function ensureUniqueLandmarks(node) {
  return addUniqueIdsToReactElement(node);
}

// NEW: Create an accessible table with optional caption
function createAccessibleTableWithCaption(headers, rows, caption) {
  const tableElement = createAccessibleTable(headers, rows);
  if (caption) {
    return React.createElement(
      'div',
      null,
      React.createElement('caption', { id: `table-caption-${Date.now()}` }, caption),
      tableElement
    );
  }
  return tableElement;
}

// NEW: Create an accessible SVG with proper accessible name (title + desc linked)
function createAccessibleSVGWithName(title, description, children) {
  const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  const descId = `svg-desc-${Math.random().toString(36).substr(2, 9)}`;
  return React.createElement(
    'svg',
    {
      role: 'img',
      'aria-labelledby': titleId,
      focusable: 'false'
    },
    React.createElement('title', { id: titleId }, title),
    React.createElement('desc', { id: descId }, description),
    children
  );
}

// NEW: Create a proper accessible link with rel attribute
function createProperAccessibleLink(href, text, rel = 'noopener') {
  return React.createElement(
    'a',
    {
      href: href,
      'aria-label': text,
      rel: rel,
      target: '_self'
    },
    text
  );
}

// Create a table header cell with proper scope attribute (fix for REACT_027)
function createTableHeaderCell(content, scope = 'col') {
  return React.createElement('th', { scope: scope }, content);
}

// Create column header cell (scope="col")
function createColumnHeader(content, props = {}) {
  return React.createElement('th', { scope: 'col', ...props }, content);
}

// Create row header cell (scope="row")
function createRowHeader(content, props = {}) {
  return React.createElement('th', { scope: 'row', ...props }, content);
}

// Create a table row with properly scoped headers
function createTableRowWithHeaders(headers, isHeaderRow = true, rowProps = {}) {
  return React.createElement(
    'tr',
    rowProps,
    headers.map((header, index) =>
      React.createElement(
        isHeaderRow ? 'th' : 'td',
        { key: index, scope: isHeaderRow ? 'col' : undefined },
        header
      )
    )
  );
}

// Create table header with properly scoped th elements
function createTableHead(headers) {
  return React.createElement(
    'thead',
    null,
    React.createElement(
      'tr',
      null,
      headers.map((header, index) =>
        React.createElement('th', { key: index, scope: 'col' }, header)
      )
    )
  );
}

// Add any new functions or changes requested in the issue
// while preserving all existing functionality

// Export the new functions for use in other files
module.exports = {
  wrapWithMain,
  addMainToHTML,
  addLanguageAttribute,
  createAccessibleTable,
  createLandmarkStructure,
  createAccessibleSVG,
  createFaviconSVG,
  createAccessibleLink,
  createAccessibleForm,
  createAccessibleButton,
  createSkipToContentLink,
  ensureSingleMainLandmark,
  // NEW exports from HEAD
  generateUniqueLandmarkId,
  ensureUniqueLandmarks,
  createAccessibleTableWithCaption,
  createAccessibleSVGWithName,
  createProperAccessibleLink,
  // New exports for table accessibility (REACT_027 fix)
  createTableHeaderCell,
  createColumnHeader,
  createRowHeader,
  createTableRowWithHeaders,
  createTableHead,
  // Preserve all existing exports
  jest,
  React,
  eslint,
  typescript
};