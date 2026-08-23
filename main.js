const express = require('express');
const app = express();

const fs = require('fs');
const path = require('path');

function fixDependencyDashboard() {
  const workflowPath = path.join(__dirname, '.github', 'workflows', 'gitstream.yml');
  if (fs.existsSync(workflowPath)) {
    let content = fs.readFileSync(workflowPath, 'utf8');
    content = content.replace(
      /linear-bots\/gitstream-github-action\s+v2/g,
      'linear-bots/gitstream-github-action@v2'
    );
    fs.writeFileSync(workflowPath, content, 'utf8');
  }
}

function generateHtmlWithLang() {
  const html = `
<html lang="en">
<!-- ... Your existing html content ... -->
</html>
  `;

  return html;
}

// Accessibility middleware for ARIA live regions and focus management
app.use((req, res, next) => {
  // Set ARIA live region for dynamic content announcements
  res.locals.ariaLiveRegion = 'polite';

  // Helper to ensure focus management for dynamic content
  res.locals.manageFocus = function(elementId) {
    if (typeof document !== 'undefined' && elementId) {
      const element = document.getElementById(elementId);
      if (element && element.focus) {
        element.setAttribute('tabindex', '-1');
        element.focus();
      }
    }
  };

  // Helper for keyboard navigation
  res.locals.handleKeyboardNav = function(event, callback) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // Helper to add lang attribute to HTML element (REACT_015)
  res.locals.addLangAttribute = function(lang = 'en') {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  };

  next();
});

// New functions for addressing accessibility issues
function addLandmark(element, role = 'banner', id) {
  if (!id) id = element.id || 'landmark-' + Date.now();
  element.setAttribute('role', role);
  element.setAttribute('id', id);
}

function addAccessibleSvgName(svg, name) {
  if (svg && svg.firstChild && svg.firstChild.nodeName === 'svg') {
    addAccessibleLabel(svg, name);
  }
}

function setSVGAccessibleName(svg, name) {
  if (svg) {
    if (svg.firstChild && svg.firstChild.nodeName === 'svg') {
      addAccessibleLabel(svg, name);
    } else {
      addAccessibleLabel(svg, name);
    }
  }
}

function ensureUniqueLandmarkIds(elements) {
  const ids = new Set();
  elements.forEach((element) => {
    if (!element) return;
    const id = element.id;
    if (ids.has(id)) {
      const index = ids.size + 1;
      element.id = id + '-' + index;
    }
    ids.add(element.id);
  });
}

function setFakeLinkAsVisible(link) {
  if (link) {
    link.setAttribute('aria-hidden', 'false');
    link.setAttribute('role', 'button');
  }
}

// Helper function to add accessible labels to elements
function addAccessibleLabel(element, label) {
  if (element) {
    element.setAttribute('aria-label', label);
    element.setAttribute('role', 'button');
  }
  return element;
}

// Helper function to announce content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  if (typeof document === 'undefined') return;
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);
  setTimeout(() => announcement.remove(), 1000);
}

// Helper to trap focus within a container (for modals)
function trapFocus(container) {
  if (!container || typeof container.querySelectorAll !== 'function') return;
  const focusableElements = container.querySelectorAll(
    'a[href], area[href], input:not([disabled]), button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        if (lastElement && lastElement.focus) lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        if (firstElement && firstElement.focus) firstElement.focus();
      }
    }
  });
}

// Apply the new functions to the relevant elements
app.get('/', (req, res) => {
  // Existing route code can send the generated HTML
  const html = generateHtmlWithLang();

  // Add accessibility to the rendered HTML when in a DOM environment
  if (typeof document !== 'undefined') {
    try {
      const body = document.body || document.querySelector('body');
      if (body) {
        addLandmark(body, 'banner');
        const svg = body.querySelector('svg');
        if (svg) setSVGAccessibleName(svg, ' dependency graph');
        const elements = [
          body.querySelector('.table-of-contents'),
          body.querySelector('section.content')
        ].filter(Boolean);
        ensureUniqueLandmarkIds(elements);
        const btnDownload = body.querySelector('.btn-download');
        if (btnDownload) setFakeLinkAsVisible(btnDownload);
        body.querySelectorAll('.btn').forEach((btn) => {
          addAccessibleLabel(btn, btn.textContent || '');
        });
      }
    } catch (e) {
      // Ignore DOM manipulation errors in server-only contexts
    }
  }

  res.send(html);
});

// Modify the build script to use the new function
const html = generateHtmlWithLang();
try {
  const docsDir = path.join(__dirname, 'docs');
  if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
  fs.writeFileSync(path.join(docsDir, 'dependency-graph.html'), html, 'utf8');
} catch (e) {
  // Optional build step
}

// Export the new functions and the fixDependencyDashboard function
module.exports = {
  app,
  fixDependencyDashboard,
  generateHtmlWithLang,
  addLandmark,
  addAccessibleSvgName,
  setSVGAccessibleName,
  ensureUniqueLandmarkIds,
  setFakeLinkAsVisible,
  addAccessibleLabel,
  announceToScreenReader,
  trapFocus
};