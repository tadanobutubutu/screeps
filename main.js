// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report — FIXED (combined with the export code)

// Utility functions for accessibility
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: () => {
    const skipLink = document.querySelector('.skip-link, [role="navigation"] a:first-child, #skip-to-content');
    if (skipLink) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = skipLink.getAttribute('href')?.substring(1) || skipLink.getAttribute('aria-controls');
        const target = document.getElementById(targetId) || document.querySelector('main, [role="main"]');
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: (element) => {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };
    
    element.addEventListener('keydown', handleTabKey);
    
    // Return cleanup function for accessibility
    return () => {
      element.removeEventListener('keydown', handleTabKey);
    };
  },

  // Announce message to screen readers
  announceToScreenReader: (message, priority = 'polite') => {
    // Remove any existing announcer to ensure fresh announcement
    const existingAnnouncer = document.querySelector('[role="status"], [role="alert"], .sr-only.aria-live-announcer');
    if (existingAnnouncer) {
      existingAnnouncer.remove();
    }
    
    const announcer = document.createElement('div');
    announcer.setAttribute('role', priority === 'assertive' ? 'alert' : 'status');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only aria-live-announcer';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.style.width = '1px';
    announcer.style.height = '1px';
    announcer.style.overflow = 'hidden';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Force a reflow to ensure the announcement is made
    void announcer.offsetHeight;
    
    // Clean up after announcement
    setTimeout(() => {
      if (announcer.parentNode) {
        announcer.remove();
      }
    }, 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: (e, handlers) => {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // Manage focus for dynamic content updates
  manageFocusOnUpdate: (container, previousActiveElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else if (previousActiveElement && previousActiveElement.focus) {
      previousActiveElement.focus();
    }
  },

  // Ensure proper labeling for interactive elements
  ensureLabeling: (element, label) => {
    const existingLabel = element.getAttribute('aria-label') || element.getAttribute('aria-labelledby');
    if (!existingLabel) {
      element.setAttribute('aria-label', label);
    }
    return element;
  },

  // Announce errors to screen readers
  announceError: (errorMessage) => {
    accessibilityUtils.announceToScreenReader(`Error: ${errorMessage}`, 'assertive');
  }
};

// Export functionality with accessibility support
const exportUtils = {
  exportData: (data, filename, mimeType) => {
    try {
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Ensure download link is accessible
      link.setAttribute('aria-label', `Download ${filename}`);
      link.setAttribute('role', 'button');
      
      // Handle keyboard activation
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          link.click();
        }
      });
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up DOM
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
      
      // Announce download completion to screen readers
      accessibilityUtils.announceToScreenReader(`Download of ${filename} started`);
    } catch (error) {
      accessibilityUtils.announceError(`Failed to download ${filename}: ${error.message}`);
      throw error;
    }
  },

  exportToJSON: (data, filename) => {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      exportUtils.exportData(jsonString, filename || 'export.json', 'application/json');
    } catch (error) {
      accessibilityUtils.announceError(`Failed to export to JSON: ${error.message}`);
      throw error;
    }
  },

  exportToCSV: (data, filename) => {
    if (!data || data.length === 0) {
      accessibilityUtils.announceError('No data available to export');
      return;
    }
    
    try {
      const headers = Object.keys(data[0]);
      const csvRows = [];
      
      // Add header row
      csvRows.push(headers.join(','));
      
      for (const row of data) {
        const values = headers.map(header => {
          const value = row[header] === null || row[header] === undefined ? '' : row[header];
          const escaped = ('' + value).replace(/"/g, '\\"');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(','));
      }
      
      const csvString = csvRows.join('\n');
      exportUtils.exportData(csvString, filename || 'export.csv', 'text/csv');
    } catch (error) {
      accessibilityUtils.announceError(`Failed to export to CSV: ${error.message}`);
      throw error;
    }
  }
};

// Initialize accessibility features
const initAccessibility = () => {
  accessibilityUtils.initSkipLink();
  
  // Add keyboard support for all interactive elements
  document.addEventListener('DOMContentLoaded', () => {
    const interactiveElements = document.querySelectorAll('[role="button"], [role="link"], a, button, input[type="submit"], input[type="button"]');
    
    interactiveElements.forEach((element) => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
            e.preventDefault();
            element.click();
          }
        }
      });
    });
  });
};

// Initialize on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export all utilities
module.exports = {
  accessibilityUtils,
  exportUtils,
  initAccessibility
};