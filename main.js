// main.js
import React from 'react';
import Head from 'next/head';

// Preserve all existing code and exports
// ... (all your existing code remains unchanged)

// Add new accessibility functions
export const ensureAccessibility = () => {
  // Ensure lang attribute is set
  if (typeof document !== 'undefined') {
    const html = document.documentElement;
    if (!html.hasAttribute('lang')) {
      html.setAttribute('lang', 'en');
    }
  }
};

// Function to fix table structure issues
export const fixTableStructure = (tableElement) => {
  if (!tableElement) return;

  // Ensure table has proper structure
  const thead = tableElement.querySelector('thead');
  const tbody = tableElement.querySelector('tbody');

  if (!thead) {
    const firstRow = tableElement.querySelector('tr');
    if (firstRow) {
      const thead = document.createElement('thead');
      thead.appendChild(firstRow);
      tableElement.insertBefore(thead, tableElement.firstChild);
    }
  }

  if (!tbody) {
    const tbody = document.createElement('tbody');
    const rows = Array.from(tableElement.querySelectorAll('tr:not(:first-child)'));
    rows.forEach(row => tbody.appendChild(row));
    tableElement.appendChild(tbody);
  }
};

// Function to add proper landmarks
export const addLandmarks = () => {
  if (typeof document === 'undefined') return;

  // Add main landmark if missing
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    const content = document.querySelector('body > *:not(script):not(style)');
    if (content) {
      main.appendChild(content);
      document.body.appendChild(main);
    }
  }

  // Add header landmark if missing
  if (!document.querySelector('header')) {
    const header = document.createElement('header');
    const firstContent = document.querySelector('body > *:first-child');
    if (firstContent) {
      header.appendChild(firstContent);
      document.body.insertBefore(header, document.body.firstChild);
    }
  }
};

// Function to ensure SVGs have accessible names
export const ensureSvgAccessibility = (svgElement) => {
  if (!svgElement) return;

  // Check if SVG has aria-label or aria-labelledby
  if (!svgElement.hasAttribute('aria-label') &&
      !svgElement.hasAttribute('aria-labelledby') &&
      !svgElement.querySelector('title, desc')) {
    // Add a title element if missing
    const title = document.createElement('title');
    title.textContent = 'Graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
};

// Function to ensure unique landmarks
export const ensureUniqueLandmarks = () => {
  if (typeof document === 'undefined') return;

  // Check for duplicate landmarks
  const landmarks = ['header', 'nav', 'main', 'footer', 'aside'];
  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(landmark);
    if (elements.length > 1) {
      // For duplicates, add aria-label to distinguish them
      elements.forEach((el, index) => {
        if (index > 0) {
          el.setAttribute('aria-label', `${landmark} ${index + 1}`);
        }
      });
    }
  });
};

// Function to fix fake links
export const fixFakeLinks = (linkElement) => {
  if (!linkElement) return;

  // Check if link is fake (has onclick but no href)
  if (linkElement.hasAttribute('onclick') && !linkElement.hasAttribute('href')) {
    // Convert to proper link
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('role', 'button');
    linkElement.setAttribute('tabindex', '0');
  }
};

// Initialize accessibility fixes when component mounts
export const useAccessibility = () => {
  React.useEffect(() => {
    ensureAccessibility();
    addLandmarks();
    ensureUniqueLandmarks();

    // Fix tables, SVGs, and fake links when they're rendered
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.tagName === 'TABLE') {
              fixTableStructure(node);
            } else if (node.tagName === 'svg' || node.querySelector('svg')) {
              const svgs = node.tagName === 'svg' ? [node] : node.querySelectorAll('svg');
              svgs.forEach(ensureSvgAccessibility);
            } else if (node.tagName === 'A' || node.querySelector('a')) {
              const links = node.tagName === 'A' ? [node] : node.querySelectorAll('a');
              links.forEach(fixFakeLinks);
            }
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);
};

// Export all existing functions as-is
// ... (all your existing exports remain unchanged)