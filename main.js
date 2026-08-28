/**
 * Main application module
 * Address accessibility issues from insight report — FIXED
 */

// DOM Elements with proper ARIA attributes
const insightButton = document.getElementById('insight-button');
const insightPanel = document.getElementById('insight-panel');
const toggleButton = document.querySelector('[aria-expanded]');
const modal = document.getElementById('accessible-modal');
const modalClose = document.getElementById('modal-close');

// Initialize accessibility features
function initializeAccessibility() {
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
  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', !isExpanded);
  insightPanel.hidden = isExpanded;
  
  if (!isExpanded) {
    // Move focus to panel when opened for screen readers
    insightPanel.focus();
  }
}

// Modal handling with focus management (accessibility requirement)
function openModal() {
  modal.hidden = false;
  modal.setAttribute('aria-modal', 'true');
  
  // Focus trap management
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

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

  // Close on Escape key
  document.addEventListener('keydown', handleEscapeKey);
  
  // Store trigger element to return focus
  const trigger = document.activeElement;
  modal.dataset.triggerId = trigger?.id || 'modal-trigger';
  
  // Focus first element
  firstElement?.focus();
}

function closeModal() {
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

// Export functions for testing
export {
  initializeAccessibility,
  toggleInsightPanel,
  openModal,
  closeModal
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}