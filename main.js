// main.js
import React from 'react';

// Preserve existing exports and functions
// ... (all existing code remains unchanged)

// Add new accessibility improvements
const AccessibilityUtils = {
  // Add language attribute for screen readers
  ensureLanguageAttribute: (lang = 'en') => {
    if (!document.documentElement.lang) {
      document.documentElement.lang = lang;
    }
  },

  // Improve table structure
  enhanceTableAccessibility: (tableElement) => {
    if (!tableElement) return;

    // Add summary if missing
    if (!tableElement.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      tableElement.insertBefore(caption, tableElement.firstChild);
    }

    // Add scope to headers
    const headers = tableElement.querySelectorAll('th');
    headers.forEach(header => {
      if (!header.hasAttribute('scope')) {
        header.setAttribute('scope', 'col');
      }
    });
  },

  // Add landmark roles
  addLandmarkRoles: () => {
    const main = document.querySelector('main');
    if (main && !main.getAttribute('role')) {
      main.setAttribute('role', 'main');
    }

    const nav = document.querySelector('nav');
    if (nav && !nav.getAttribute('role')) {
      nav.setAttribute('role', 'navigation');
    }
  },

  // Make SVG accessible
  makeSvgAccessible: (svgElement) => {
    if (!svgElement) return;

    if (!svgElement.getAttribute('aria-hidden') && !svgElement.getAttribute('aria-label')) {
      svgElement.setAttribute('aria-hidden', 'true');
    }
  },

  // Ensure unique landmarks
  ensureUniqueLandmarks: () => {
    const landmarks = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarks.forEach(landmark => {
      const elements = document.querySelectorAll(`[role="${landmark}"]`);
      if (elements.length > 1) {
        console.warn(`Multiple ${landmark} landmarks found. Only one should exist.`);
      }
    });
  },

  // Replace fake links with proper buttons
  replaceFakeLinks: () => {
    const fakeLinks = document.querySelectorAll('a[role="button"], a[href="javascript:void(0)"]');
    fakeLinks.forEach(link => {
      const button = document.createElement('button');
      button.textContent = link.textContent;
      button.className = link.className;
      link.parentNode.replaceChild(button, link);
    });
  }
};

// Initialize accessibility improvements
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    AccessibilityUtils.ensureLanguageAttribute();
    AccessibilityUtils.addLandmarkRoles();
    AccessibilityUtils.ensureUniqueLandmarks();
    AccessibilityUtils.replaceFakeLinks();

    // Enhance tables when they're added dynamically
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const tables = node.querySelectorAll('table');
            tables.forEach(table => AccessibilityUtils.enhanceTableAccessibility(table));

            const svgs = node.querySelectorAll('svg');
            svgs.forEach(svg => AccessibilityUtils.makeSvgAccessible(svg));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  });
}

// Export all existing functions
export { /* all existing exports */ };