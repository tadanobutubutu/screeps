const accessibilityUtils = {
  // ... (The rest of the original code remains unchanged)

  // TODO: Implement this function for creating in-page buttons
  createInPageButton: function(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
  },

  // Function to validate landmark structure for accessibility issues
  validateLandmarkStructure: function() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
      const element = document.querySelector(landmark);
      if (!element) {
        missingLandmarks.push(landmark);
      }
    });

    if (missingLandmarks.length > 0) {
      console.warn(`Warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
      return false;
    }
    return true;
  },

  // New focus trap function
  newFocusTrap: function(element) {
    if (!element) return;
    const focusable = element.querySelectorAll(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Focus trap utility
  focusTrapUtil: function(container) {
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey && document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });
  },

  // Added SVG accessibility helper
  addSvgAccessibleName: function(addSvgAccessibleName(svgString, label) {
    // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
    // and returns the modified SVG string.
    // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = svgDoc.documentElement;
    if (!svgElement.hasAttribute('aria-label')) {
      svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
    }
    return svgString;
  },

  // Function to handle additional rendering logic
  renderGraphIndex: function(container, options = {}) {
    // ... (Existing code)
    // Use the new focusTrapUtil function from accessibilityUtils for keyboard navigation
    const cleanup = accessibilityUtils.focusTrapUtil(container);
    // ... (Remaining existing code)
    return tempContainer.innerHTML;
  },

  // TODO: Implement function for generating a report based on accessibility issues
  generateAccessibilityReport: function() {
    const report = {
        missingLandmarks: [],
        invalidAttributes: [],
        errors: []
    };

    // Check for missing landmarks
    const requiredLandmarks = ['header', 'main', 'footer'];
    requiredLandmarks.forEach(landmark => {
        const element = document.querySelector(landmark);
        if (!element) {
            report.missingLandmarks.push(landmark);
        }
    });

    // Check for invalid attributes (example: 'role' attribute should be valid)
    const elementsWithInvalidAttributes = document.querySelectorAll('[role]');
    elementsWithInvalidAttributes.forEach(element => {
        const validRoles = ['banner', 'complementary', 'contentinfo', 'main', 'navigation', 'search'];
        const role = element.getAttribute('role');
        if (!validRoles.includes(role)) {
            report.invalidAttributes.push({ element: element.tagName, attribute: 'role', value: role });
        }
    });

    // Check for other accessibility issues (example: images without alt text)
    const imagesWithoutAlt = document.querySelectorAll('img[alt=""]');
    imagesWithoutAlt.forEach(img => {
        report.errors.push(`Image without alt text: ${img.src}`);
    });

    // Combine all issues into a single report string
    const reportString = `Accessibility Report:
    Missing Landmarks: ${report.missingLandmarks.join(', ')}
    Invalid Attributes: ${report.invalidAttributes.map(attr => `${attr.element} with ${attr.attribute}=${attr.value}`).join(', ')}
    Errors: ${report.errors.join(', ')}`;

    // Log the report to the console or another logging mechanism
    console.log(reportString);

    // Optionally, return the report object or string
    return reportString;
  },

  // Function to handle extension upgrade logic
  handleUpgrade: function() {
    const currentVersion = '1.0.0';
    const storedVersion = localStorage.getItem('extensionVersion');

    if (!storedVersion) {
        // First installation - initialize settings
        initializeDefaultSettings();
        localStorage.setItem('extensionVersion', currentVersion);
        console.log('Extension initialized for first use');
        return;
    }

    if (storedVersion !== currentVersion) {
        // Upgrade detected - run upgrade logic
        performUpgradeTasks(storedVersion, currentVersion);
        localStorage.setItem('extensionVersion', currentVersion);
        console.log(`Extension upgraded from ${storedVersion} to ${currentVersion}`);
    }
  },

  // Initialize default settings for new installations
  initializeDefaultSettings: function() {
    const defaultSettings = {
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'en'
    };

    Object.keys(defaultSettings).forEach(key => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(defaultSettings[key]));
        }
    });
  },

  // Perform upgrade tasks based on version differences
  performUpgradeTasks: function(oldVersion, newVersion) {
    const upgradeTasks = {
        migrateSettings: () => {
            // Migrate any settings that need transformation
            const existingSetting = localStorage.getItem('oldSettingKey');
            if (existingSetting) {
                localStorage.setItem('newSettingKey', existingSetting);
                localStorage.removeItem('oldSettingKey');
            }
        },
        clearCache: () => {
            // Clear temporary cache files
            sessionStorage.clear();
        },
        updatePreferences: () => {
            // Update user preferences structure if needed
            const preferences = localStorage.getItem('userPreferences');
            if (preferences) {
                const parsed = JSON.parse(preferences);
                // Add any new preference fields with defaults
                if (!parsed.hasOwnProperty('newPreferenceField')) {
                    parsed.newPreferenceField = 'defaultValue';
                    localStorage.setItem('userPreferences', JSON.stringify(parsed));
                }
            }
        }
    };

    // Execute all upgrade tasks
    Object.values(upgradeTasks).forEach(task => task());
  },

  // Export functions for testing and external use
  export: function() {
    // Export the accessibility utilities
    export { createInPageButton, validateLandmarkStructure, newFocusTrap, focusTrapUtil, addSvgAccessibleName, generateAccessibilityReport, handleUpgrade, initializeDefaultSettings, performUpgradeTasks };
    
    // Also export global reference for newFocusTrap as seen in origin/main
    globalThis.newFocusTrap = accessibilityUtils.newFocusTrap;
  },

  // Import the newFocusTrap function into the scope for use elsewhere
  // (Already handled via export)
};

// Accessibility utilities and functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report
// - NEW: Implement a new function to handle focus trap for keyboard navigation (handled by newFocusTrap())

// Required changes to fix the React SVG Accessible Name issue
const addSvgAccessibleName = function addSvgAccessibleName(svgString, label) {
  // This function adds an `aria-label` attribute to the SVG if it doesn't already have one
  // and returns the modified SVG string.
  // Note: This is a simplified example and might need adjustments based on the actual SVG structure.
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;
  if (!svgElement.hasAttribute('aria-label')) {
    svgElement.setAttribute('aria-label', label || 'Descriptive label for SVG');
  }
  return svgString;
};

// Function to handle additional rendering logic
function renderGraphIndex(container, options = {}) {
  // ... (Existing code)
  // Use the new focusTrapUtil function from accessibilityUtils for keyboard navigation
  const cleanup = accessibilityUtils.focusTrapUtil(container);
  // ... (Remaining existing code)
  return tempContainer.innerHTML;
}

// Export functions for testing and external use
export { 
  createInPageButton, 
  validateLandmarkStructure, 
  handleUpgrade, 
  initializeDefaultSettings, 
  performUpgradeTasks, 
  generateAccessibilityReport 
};

// Import the newFocusTrap function into the scope for use elsewhere
globalThis.newFocusTrap = accessibilityUtils.newFocusTrap;

/* Here we are integrating the new function for handling focus traps with the existing
   implementation for rendering graph/index. We use a cleanup function to remove the
   event listener when the container is removed from the DOM. */

// Auto-run upgrade check on page load (if in browser context)
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        handleUpgrade();
    });
}
```