// Here is an example of how to export a required function from another file:

// main.js - Accessible Insight Report Interface
// Line 13: Address accessibility issues from insight report — CONTINUING

const { helperFunction } = require('./helpers');
const { formatData, validateInput } = require('./utils');

// Main application logic
function main() {
  console.log('Application started');
}

// Accessibility helper function to announce dynamic content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('sr-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = message;
  
  // Clear after announcement to allow re-announcement of same message
  setTimeout(() => {
    announcer.textContent = '';
  }, 1000);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'sr-announcer';
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  announcer.style.cssText = 'position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;';
  document.body.appendChild(announcer);
  return announcer;
}

// Trap focus within modal dialogs for accessibility
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  function handleTabKey(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
    // Close on Escape key
    if (e.key === 'Escape') {
      element.setAttribute('aria-hidden', 'true');
      element.style.display = 'none';
      document.removeEventListener('keydown', handleTabKey);
    }
  }

  document.addEventListener('keydown', handleTabKey);
  firstFocusable && firstFocusable.focus();
}

// Update ARIA expanded state for collapsible sections
function toggleAriaExpanded(element) {
  const isExpanded = element.getAttribute('aria-expanded') === 'true';
  element.setAttribute('aria-expanded', !isExpanded);
  
  const controlsId = element.getAttribute('aria-controls');
  if (controlsId) {
    const controlledElement = document.getElementById(controlsId);
    if (controlledElement) {
      controlledElement.setAttribute('aria-hidden', isExpanded);
    }
  }
}

// Handle missing alt text for images
function handleMissingAltText(container) {
  const images = container.querySelectorAll('img:not([alt])');
  images.forEach((img, index) => {
    img.setAttribute('alt', `Image ${index + 1} - description unavailable`);
    img.setAttribute('role', 'presentation');
  });
  
  // Add warning for accessibility audit
  if (images.length > 0) {
    console.warn(`Accessibility: ${images.length} image(s) had missing alt text and were assigned default descriptions.`);
  }
}

// Accessibility function to add lang attribute to the HTML element
function addLangAttribute() {
  document.documentElement.lang = 'en';
}

// Accessibility function to fix table structure issues
function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        const thead = document.createElement('thead');
        const tbody = table.querySelector('tbody');
        thead.appendChild(firstRow);
        table.insertBefore(thead, tbody || table.firstChild);
      }
    }
    table.querySelectorAll('td').forEach(td => {
      if (!td.hasAttribute('headers') && !td.hasAttribute('scope')) {
        td.setAttribute('scope', 'col');
      }
    });
  });
}

// Accessibility function to ensure proper main landmark
function addMainLandmark() {
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length === 0) {
    const mainElement = document.createElement('main');
    const body = document.body;
    if (body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else {
      body.appendChild(mainElement);
    }
  }
}

// Accessibility function to add accessible names to SVGs
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-label])');
  svgs.forEach((svg, index) => {
    const titleId = `svg-title-${index}`;
    let title = svg.querySelector('title');
    if (!title) {
      title = document.createElement('title');
      title.id = titleId;
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('aria-labelledby')) {
      svg.setAttribute('aria-labelledby', title.id || titleId);
    }
  });
}

// Accessibility function to ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('header, footer, nav, aside, section[aria-label], section[aria-labelledby]');
  landmarks.forEach(landmark => {
    const tagName = landmark.tagName.toLowerCase();
    if ((tagName === 'header' || tagName === 'footer') && !landmark.closest('main')) {
      // Keep multiple headers/footers outside main
    } else if (landmark.querySelector('main') || landmark.closest('main')) {
      // Ensure main is not nested incorrectly
      const nestedMain = landmark.querySelector('main');
      if (nestedMain && !landmark.closest('section') && !landmark.closest('article')) {
        const parent = landmark.parentNode;
        if (parent) {
          parent.insertBefore(nestedMain, landmark.nextSibling);
        }
      }
    }
  });
}

// Accessibility function to fix fake link issues
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    const onclick = link.getAttribute('onclick');
    const isButton = link.getAttribute('role') === 'button' || link.tagName === 'BUTTON';
    if ((onclick || isButton) && !link.getAttribute('href')) {
      link.setAttribute('role', 'button');
      if (onclick) {
        link.setAttribute('tabindex', '0');
      }
    }
  });
  const buttonsAsLinks = document.querySelectorAll('button[href], a[onclick]');
  buttonsAsLinks.forEach(element => {
    if (element.tagName === 'BUTTON' && element.hasAttribute('href')) {
      element.removeAttribute('href');
    }
  });
}

// Initialize accessibility features on DOM ready
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    // Ensure all form inputs have associated labels
    const inputs = document.querySelectorAll('input:not([id]), select:not([id]), textarea:not([id])');
    inputs.forEach((input, index) => {
      const id = input.id || `auto-input-${index}`;
      input.id = id;
      
      if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = `Input ${index + 1}`;
        label.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);';
        input.parentNode.insertBefore(label, input);
      }
    });

    // Ensure buttons are keyboard accessible
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      if (!button.hasAttribute('tabindex') && !button.hasAttribute('aria-label')) {
        // Button is accessible by default
      }
    });

    // Handle missing alt text for images
    handleMissingAltText(document.body);

    // Run origin/main accessibility improvements
    addLangAttribute();
    fixTableStructureIssues();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();

    announceToScreenReader('Page loaded and accessibility features initialized', 'assertive');
  });
}

// Export functions that might be required by other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    main,
    helperFunction,
    formatData,
    validateInput,
    announceToScreenReader,
    trapFocus,
    toggleAriaExpanded,
    handleMissingAltText,
    addLangAttribute,
    fixTableStructureIssues,
    addMainLandmark,
    addSvgAccessibleNames,
    ensureUniqueLandmarks,
    fixFakeLinkIssue
  };
}