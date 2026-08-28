// main.js

/**
 * Accessibility improvements applied based on insight report findings.
 * Resolved issues: ARIA attributes, focus management, semantic roles, and keyboard navigation.
 */

// Ensure the root element has proper accessibility attributes
function initializeAccessibility() {
  const root = document.getElementById('root') || document.getElementById('app');
  if (root) {
    root.setAttribute('role', 'application');
    root.setAttribute('aria-label', 'Application');
  }
}

// Manage focus for improved keyboard navigation
function manageFocus(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.setAttribute('tabindex', '0');
    element.focus();
  }
}

// Add ARIA labels to interactive elements
function enhanceInteractiveElements() {
  const buttons = document.querySelectorAll('button, [role="button"]');
  buttons.forEach((btn) => {
    if (!btn.getAttribute('aria-label') && !btn.getAttribute('aria-labelledby')) {
      const text = btn.textContent?.trim();
      if (text) {
        btn.setAttribute('aria-label', text);
      }
    }
  });

  const links = document.querySelectorAll('a[href]');
  links.forEach((link) => {
    if (!link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
      const text = link.textContent?.trim();
      if (text) {
        link.setAttribute('aria-label', text);
      }
    }
  });
}

// Ensure images have alt text
function ensureAltText() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });
}

// Set up live regions for dynamic content updates
function createLiveRegion(regionId, politeness = 'polite') {
  let region = document.getElementById(regionId);
  if (!region) {
    region = document.createElement('div');
    region.id = regionId;
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', politeness);
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    document.body.appendChild(region);
  }
  return region;
}

// Announce dynamic content changes to screen readers
function announceToScreenReader(message, politeness = 'polite') {
  const region = createLiveRegion(`live-region-${politeness}`, politeness);
  region.textContent = '';
  setTimeout(() => {
    region.textContent = message;
  }, 100);
}

// Keyboard navigation helper
function handleKeyboardNavigation(element, callback) {
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback(event);
    }
  });
}

// Ensure skip navigation link exists
function ensureSkipLink() {
  let skipLink = document.getElementById('skip-link');
  if (!skipLink) {
    skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    skipLink.addEventListener('focus', () => {
      skipLink.style.position = 'fixed';
      skipLink.style.top = '10px';
      skipLink.style.left = '10px';
      skipLink.style.width = 'auto';
      skipLink.style.height = 'auto';
      skipLink.style.padding = '8px 16px';
      skipLink.style.background = '#000';
      skipLink.style.color = '#fff';
      skipLink.style.zIndex = '9999';
    });
    skipLink.addEventListener('blur', () => {
      skipLink.style.position = 'absolute';
      skipLink.style.left = '-9999px';
    });
    document.body.insertBefore(skipLink, document.body.firstChild);
  }
}

// Initialize all accessibility improvements
function initAccessibility() {
  initializeAccessibility();
  enhanceInteractiveElements();
  ensureAltText();
  ensureSkipLink();
}

// Export functions for use in other modules
export {
  initializeAccessibility,
  manageFocus,
  enhanceInteractiveElements,
  ensureAltText,
  createLiveRegion,
  announceToScreenReader,
  handleKeyboardNavigation,
  ensureSkipLink,
  initAccessibility,
};