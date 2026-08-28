// main.js - Application entry point

const express = require('express');
const app = express();
const loop = require('./loop');
const config = require('./config');
const logger = require('./utils/logger');

// Existing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Existing routes and server start
// (These comments remain as-is)

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Welcome to the application');
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// New functions
function newFunction() {
  // Implementation of the new function
  console.log('This is the new function.');
}

function modifiedFunction() {
  // Modified implementation of the function
  console.log('This function has been modified.');
}

// Accessibility features for DOM environment (From origin)
let insightButton, insightPanel, toggleButton, modal, modalClose;

// Initialize accessibility features (Merged)
function initializeAccessibility() {
  if (typeof document === 'undefined') return;

  // Initialization of the existing accessibility functions

  // DOM Elements with proper ARIA attributes
  insightButton = document.getElementById('insight-button');
  insightPanel = document.getElementById('insight-panel');
  toggleButton = document.querySelector('[aria-expanded]');
  modal = document.getElementById('accessible-modal');
  modalClose = document.getElementById('modal-close');

  // Ensure all interactive elements are keyboard accessible
   ... (The rest of the existing initializeAccessibility function continues)
}

// Toggle insight panel with proper ARIA attributes (Merged)
function toggleInsightPanel() {
  if (!toggleButton || !insightPanel) return;

  const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
  toggleButton.setAttribute('aria-expanded', !isExpanded);
  insightPanel.hidden = isExpanded;

  if (!isExpanded) {
    // Move focus to panel when opened for screen readers
    insightPanel.focus();
  }
}

// Modal handling with focus management (accessibility requirement) (Merged)
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

    // Focus first element
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

// Setup event listeners (Merged)
function setupAccessibilityEventListeners() {
  if (typeof document === 'undefined') return;

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (insightButton) {
    insightButton.addEventListener('click', toggleInsightPanel);
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

// Export functions for testing (Merged)
module.exports = {
  loop,
  express,
  config,
  logger,
  newFunction,
  modifiedFunction,
  initialize,
  app,
  getApp,
  initializeAccessibility,
  toggleInsightPanel,
  openModal,
  closeModal,
  setupAccessibilityEventListeners
};

// Initialize on DOM ready (Updated to use `getApp` from the exported functions instead of directly using `app` from the import)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeAccessibility();
      setupAccessibilityEventListeners();
    });
  } else {
    initializeAccessibility();
    setupAccessibilityEventListeners();
  }
}

// Addition: A function to get the app instance (This function extracts and returns the `app` instance from within the exported object, as it is needed later in the repository)
function getApp() {
  return module.exports.app;
}