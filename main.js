// TODO: Add back any required exports that might have been removed
// Here’s an example of how to export a required function from another file:
// Import functions from other modules if needed
// const { someFunction } = require('./utils');

// REACT_015: React Language Attribute
export function setLanguage(lang = 'en') {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// REACT_027: React Table Structure
export function createTable(columns, data) {
  return {
    type: 'table',
    children: [
      {
        type: 'thead',
        children: {
          type: 'tr',
          children: columns.map(col => ({
            type: 'th',
            props: { scope: 'col', children: col }
          }))
        }
      },
      {
        type: 'tbody',
        children: data.map(row => ({
          type: 'tr',
          children: columns.map(col => ({
            type: 'td',
            children: row[col]
          }))
        }))
      }
    ]
  };
}

// REACT_041: React SVG Accessible Name
export function createSVG(label, children) {
  return {
    type: 'svg',
    props: { 'aria-label': label, children }
  };
}

// REACT_025: React Unique Landmarks
export function createLandmark(role, label, children) {
  return {
    type: role,
    props: { 'aria-label': label, children }
  };
}

// REACT_017: React Landmarks
export function createLandmark(role, children) {
  return {
    type: role,
    props: { children }
  };
}

// REACT_036: React Fake Link
export function createFakeLink(href, children) {
  return {
    type: 'a',
    props: {
      href,
      role: 'link',
      tabIndex: 0,
      onKeyDown: (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          window.location.href = href;
        }
      },
      children
    }
  };
}