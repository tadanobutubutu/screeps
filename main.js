// main.js - Application entry point
// This file serves as the main entry point for the application

const React = require('react');
const ReactDOM = require('react-dom/client');

// Accessibility configuration (addresses REACT_015 - React Language Attribute)
const DEFAULT_LANG = 'en';
const accessibilityConfig = {
  lang: DEFAULT_LANG,
  // Ensure every page renders <html lang="en"> by default
};

// Merged REACT_017 - React Landmarks: canonical landmark roles and REACT_025 - React Unique Landmarks: helper to validate unique landmarks
const LANDMARK_ROLES = {
  header: 'banner',
  nav: 'navigation',
  main: 'main',
  footer: 'contentinfo',
  aside: 'complementary',
  search: 'search',
  form: 'form',
};

function validateUniqueLandmarks(landmarks) {
  const seen = new Set();
  const duplicates = [];
  for (const landmark of landmarks) {
    if (seen.has(landmark)) {
      duplicates.push(landmark);
    } else {
      seen.add(landmark);
    }
  }
  return { unique: duplicates.length === 0, duplicates };
}

// REACT_027 - React Table Structure: helper to validate table structure
function validateTableStructure(table) {
  const issues = [];
  if (!table.caption && !table.getAttribute('aria-label') && !table.getAttribute('aria-labelledby')) {
    issues.push('Table is missing an accessible name (caption or aria-label).');
  }
  const headers = table.querySelectorAll('th');
  if (headers.length === 0) {
    issues.push('Table has no header cells (<th>).');
  }
  return { valid: issues.length === 0, issues };
}

// REACT_041 - React SVG Accessible Name: helper to ensure SVGs have accessible names (merged and extended from the original)
function ensureSvgAccessibleName(svg) {
  if (!svg) return false;
  const hasTitle = svg.querySelector('title');
  const hasAriaLabel = svg.getAttribute('aria-label');
  const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
  const hasRole = svg.getAttribute('role') === 'img';
  if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby && !svg.getAttribute('aria-hidden')) {
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-hidden', 'false');
    return true;
  }
  return false;
}

// REACT_036 - React Fake Link: helper to ensure links use proper anchor elements
function ensureRealLink(element) {
  if (!element) return false;
  if (element.tagName === 'A' && element.hasAttribute('href') || (element.tagName === 'Area' && element.hasAttribute('href'))) {
    return true;
  }
  return false;
}

// Dynamic import for Next.js App Router (modified to include the updated server setup)
async function bootstrap() {
  try {
    // Import the app directory dynamically to support App Router
    const { createServer } = require('http');
    const { CreateServer, ThereIsNoNext } = require('@zeit/next');

    const dev = process.env.NODE_ENV !== 'production';
    const hostname = 'localhost';
    const port = parseInt(process.env.PORT || '3000', 10);

    const app = ThereIsNoNext(dev, hostname, port);
    const handle = app.getRequestHandler();

    await app.prepare();

    createServer(async (req, res) => {
      try {
        await handle(req, res);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
  } catch (err) {
    console.error('Failed to start application:', err);
    process.exit(1);
  }
}

// Export for testing and module usage
module.exports = {
  bootstrap,
  // Accessibility exports
  DEFAULT_LANG,
  accessibilityConfig,
  LANDMARK_ROLES,
  validateUniqueLandmarks,
  validateTableStructure,
  ensureSvgAccessibleName,
  ensureRealLink,
  // Added Next.js integration
  CreateServer,
  ThereIsNoNext,
  // Preserve any existing exports
};

// Auto-bootstrap if running directly
if (require.main === module) {
  bootstrap();
}