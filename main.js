/**
 * Main entry point for the application
 */

// Function to create in-page buttons
function createInPageButton(buttonText, onClickHandler) {
  const button = document.createElement('button');
  button.textContent = buttonText;
  button.addEventListener('click', onClickHandler);
  return button;
}

// TODO: Implement this function for creating in-page buttons
// (Now implemented)

// Example usage (if needed):
// const btn = createInPageButton('Click Me', () => console.log('Clicked'));
// document.body.appendChild(btn);

export { createInPageButton };

function generateAccessibilityReport(issuesData) {
  const analyzedIssues = analyzeAccessibility(issuesData); // presume this function is already defined

  // Define the structure of the report here
  const report = {
    introduction: 'Accessibility report for the application',
    data: {},
    conclusions: '',
  };

  // Fill the report's data and conclusions
  // ...

  // Return the final report
  return report;
}

const announcementId = 'accessibility-announcement';
const announcement = document.createElement('div');
announcement.id = announcementId;
announcement.setAttribute('aria-live', 'polite');
announcement.setAttribute('aria-atomic', 'true');
// Hide off-screen
announcement.style.position = 'absolute';
announcement.style.left = '-9999px';
announcement.style.top = '-9999px';
document.body.appendChild(announcement);

// Keyboard navigation support: ensure all interactive elements are keyboard-accessible
function setupKeyboardNavigation() {
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [tabindex]'
  );

  interactiveElements.forEach((el) => {
    if (el.hasAttribute('tabindex') && parseInt(el.getAttribute('tabindex'), 10) < 0) {
      return;
    }
    if (!el.hasAttribute('tabindex')) {
      const tagName = el.tagName.toLowerCase();
      if (tagName !== 'a' || el.hasAttribute('href')) {
        el.setAttribute('tabindex', '0');
      }
    }
    if (!el.hasAttribute('role')) {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'a' && !el.hasAttribute('href')) {
        el.setAttribute('role', 'button');
      }
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      const target = event.target;
      if (target && target.getAttribute('role') === 'button') {
        event.preventDefault();
        target.click();
      }
    }
    if (event.key === 'Escape') {
      const openModal = document.querySelector('[role="dialog"][aria-modal="true"]');
      if (openModal) {
        const closeButton = openModal.querySelector('[data-modal-close]');
        if (closeButton) {
          closeButton.click();
        }
      }
    }
  });

  return true;
}

// Add ARIA labels for interactive elements that lack them
function addAriaLabelsToInteractiveElements() {
  const interactiveElements = document.querySelectorAll(
    'button, a, input, select, textarea, [role="button"], [role="link"]'
  );
  let addedCount = 0;

  interactiveElements.forEach((el) => {
    const hasLabel =
      el.hasAttribute('aria-label') ||
      el.hasAttribute('aria-labelledby') ||
      el.textContent.trim().length > 0 ||
      (el.querySelector('[aria-label]') !== null);

    if (!hasLabel) {
      const tagName = el.tagName.toLowerCase();
      if (tagName === 'input' || tagName === 'select' || tagName === 'textarea') {
        const labelText = el.getAttribute('placeholder') || el.getAttribute('name') || 'Input field';
        el.setAttribute('aria-label', labelText);
      } else {
        el.setAttribute('aria-label', 'Interactive element');
      }
      addedCount += 1;
    }
  });

  return {
    totalInteractive: interactiveElements.length,
    labelsAdded: addedCount
  };
}

// Screen reader announcements helper
function announceToScreenReader(message, priority = 'polite') {
  const liveRegion = document.getElementById(announcementId);
  if (!liveRegion) {
    return false;
  }
  liveRegion.setAttribute('aria-live', priority);
  liveRegion.textContent = '';
  // Use a microtask to ensure the change is detected
  setTimeout(() => {
    liveRegion.textContent = message;
  }, 50);
  return true;
}

// Focus trapping for modals
function trapFocusInModal(modalElement) {
  if (!modalElement) {
    return false;
  }

  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(', ');

  const focusableElements = modalElement.querySelectorAll(focusableSelectors);
  if (focusableElements.length === 0) {
    return false;
  }

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  // Focus the first focusable element initially
  firstFocusable.focus();

  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') {
      return;
    }
    if (event.shiftKey) {
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  modalElement.addEventListener('keydown', handleKeyDown);

  // Store handler reference so it can be removed later
  modalElement._trapFocusHandler = handleKeyDown;

  return true;
}

function releaseFocusTrap(modalElement) {
  if (!modalElement || !modalElement._trapFocusHandler) {
    return false;
  }
  modalElement.removeEventListener('keydown', modalElement._trapFocusHandler);
  delete modalElement._trapFocusHandler;
  return true;
}

// Validate that tables in the document are accessible
function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const hasCaption = table.querySelector('caption') !== null;
    const hasHeaders = table.querySelector('th') !== null;
    const hasScope = Array.from(table.querySelectorAll('th')).every(
      th => th.hasAttribute('scope')
    );
    
    results.push({
      tableIndex: index,
      hasCaption,
      hasHeaders,
      hasScope,
      isAccessible: hasCaption && hasHeaders && hasScope
    });
  });
  
  return results;
}

// Validate the structure of tables in the document
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  const results = [];
  
  tables.forEach((table, index) => {
    const rows = table.querySelectorAll('tr');
    let isValid = true;
    let error = null;
    
    if (rows.length === 0) {
      isValid = false;
      error = 'Table has no rows';
    } else {
      const cellCounts = Array.from(rows).map(row => row.querySelectorAll('td, th').length);
      const allSame = cellCounts.every(count => count === cellCounts[0]);
      
      if (!allSame) {
        isValid = false;
        error = 'Table has inconsistent cell counts across rows';
      }
    }
    
    results.push({
      tableIndex: index,
      rowCount: rows.length,
      isValid,
      error
    });
  });
  
  return results;
}

// Export the new function
export {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  setupKeyboardNavigation,
  addAriaLabelsToInteractiveElements,
  announceToScreenReader,
  trapFocusInModal,
  releaseFocusTrap
};

// Add the new function to the default export
export default {
  VERSION,
  CONFIG,
  initialize,
  getConfig,
  getVersion,
  addressAccessibilityIssues,
  root,
  validateTableAccessibility,
  validateTableStructure,
  setupKeyboardNavigation,
  addAriaLabelsToInteractiveElements,
  announceToScreenReader,
  trapFocusInModal,
  releaseFocusTrap
};