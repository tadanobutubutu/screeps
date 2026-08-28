// TODO: This is the existing code that needs to be preserved
// Accessibility utility functions

function getLangAttribute() {
  // REACT_015: Add lang attribute to HTML element
  return 'en';
}

function createInPageButton() {
  // REACT_015 & REACT_036: Create accessible in-page button with proper attributes
  return {
    role: 'button',
    tabIndex: 0,
    ariaLabel: 'Skip to content',
    onClick: () => {}
  };
}

function validateTableAccessibility(table) {
  // REACT_027: Validate table accessibility
  const issues = [];
  if (!table.headers) {
    issues.push('Missing table headers');
  }
  if (!table.caption) {
    issues.push('Missing table caption');
  }
  return issues;
}

function validateTableStructure(table) {
  // REACT_027: Fix table structure issues
  const issues = [];
  if (table.rows && table.rows.length > 0) {
    table.rows.forEach((row, index) => {
      if (row.cells && row.cells.length > 1) {
        // Validate proper th usage
        if (!row.cells.some(cell => cell.tagName === 'TH')) {
          issues.push(`Row ${index}: Missing header cells`);
        }
      }
    });
  }
  return issues;
}

function getSvgAccessibleName(svg) {
  // REACT_041: Get SVG accessible name
  return svg.getAttribute('aria-label') || svg.getAttribute('aria-labelledby') || '';
}

function setSvgAttributes(svg, name) {
  // REACT_041: Add accessible names to SVGs
  if (name) {
    svg.setAttribute('aria-label', name);
  }
}

function ensureUniqueLandmarks() {
  // REACT_025: Ensure unique landmarks
  const landmarks = document.querySelectorAll('[role], header, footer, nav, main, aside');
  const seenIds = new Set();
  landmarks.forEach(landmark => {
    if (landmark.id && seenIds.has(landmark.id)) {
      landmark.removeAttribute('id');
    }
    seenIds.add(landmark.id);
  });
}

function validateLinkAccessibility(link) {
  // REACT_036: Validate link accessibility
  const issues = [];
  if (!link.href || link.href === '#') {
    issues.push('Link missing valid href');
  }
  if (!link.textContent && !link.getAttribute('aria-label')) {
    issues.push('Link missing accessible text');
  }
  return issues;
}

function handleFakeLinks() {
  // REACT_036: Fix fake link issues
  const fakeLinks = document.querySelectorAll('a[href="#"], a:not([href])');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    if (!link.getAttribute('aria-label') && !link.textContent) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

function addProperLandmarkRegions() {
  // REACT_037: Add proper landmark regions
  const regions = ['header', 'nav', 'main', 'aside', 'footer'];
  regions.forEach(region => {
    const elements = document.querySelectorAll(region);
    elements.forEach((el, index) => {
      if (index > 0) {
        el.setAttribute('aria-label', `${region} ${index + 1}`);
      }
    });
  });
}

// Dom element handling for accessibility in DOM environment (from origin/main)
let insightButton, insightPanel, toggleButton, modal, modalClose;

// Initialize accessibility features
function initializeAccessibility() {
  if (typeof document === 'undefined') return;

  // DOM Elements with proper ARIA attributes
  insightButton = document.getElementById('insight-button');
  insightPanel = document.getElementById('insight-panel');
  toggleButton = document.querySelector('[aria-expanded]');
  modal = document.getElementById('accessible-modal');
  modalClose = document.getElementById('modal-close');

  // Ensure all interactive elements are keyboard accessible
  const interactiveElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

  interactiveElements.forEach((element, index) => {
    element.setAttribute('tabindex', index === 0 ? '0' : '1');
  });

  // Add focus indicators for keyboard navigation
  const focusStyles = document.createElement('style');
  focusStyles.textContent = `
    :focus {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    :focus-visible {
      outline: 2px solid #005fcc;
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyles);
}

// Toggle insight panel with proper ARIA attributes
function toggleInsightPanel() {
  if (!toggleButton || !insightPanel) return;

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', !isExpanded);
  insightPanel.hidden = isExpanded;

  if (!isExpanded) {
    insightPanel.focus();
  }
}

// Modal handling with focus management (accessibility requirement)
function openModal() {
  if (!modal) return;

  modal.hidden = false;
  modal.setAttribute('aria-modal', 'true');

  // Focus trap management
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (firstElement) {
    firstElement.tabIndex = 0;

    lastElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        firstElement.focus();
      }
    });

    firstElement.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && e.shiftKey) {
        e.preventDefault();
        lastElement.focus();
      }
    });

    firstElement?.focus();
  }

  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);

  // Store trigger element to return focus
  const trigger = document.activeElement;
  modal.dataset.triggerId = trigger?.id || 'modal-trigger';
}

function closeModal() {
  if (!modal) return;

  modal.hidden = true;
  modal.removeAttribute('aria-modal');

  // Return focus to trigger element
  const triggerId = modal.dataset.triggerId;
  const trigger = document.getElementById(triggerId);
  trigger?.focus();

  // Remove escape key listener
  document.removeEventListener('keydown', handleEscapeKey);
}

function handleEscapeKey(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}

// Setup event listeners
function setupAccessibilityEventListeners() {
  if (typeof document === 'undefined') return;

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (insightButton) {
    insightButton.addEventListener('click', toggleInsightPanel);
    // Ensure keyboard accessibility
    insightButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }

  if (toggleButton) {
    toggleButton.addEventListener('click', toggleInsightPanel);
    toggleButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleInsightPanel();
      }
    });
  }
}

// New function from the conflicting branch (react_038)
function newFunction() {
  // Implementation of the new function
}

// Existing exports (do not remove or rename)
export function existingFunction() {
  // Implementation of the existing function
}

module.exports = {
  ...
  newFunction,
  ...
};