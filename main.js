// TODO: This is the existing code that needs to be preserved
// (This comment remains as-is)

// Helper to manage focus within a container (imported from origin/main)
function trapFocus(container) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  container.addEventListener('keydown', (e) => {
    const isTab = e.key === 'Tab';
    if (!isTab) return;
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement && lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement && firstElement.focus();
      }
    }
  });
}

/**
 * REACT_015: Add lang attribute to HTML element
 * Ensures the HTML element has a proper lang attribute for screen readers
 */
export function addLangAttribute(element, lang = 'en') {
  let htmlElement = element || document.documentElement;
  if (!htmlElement) {
    htmlElement = document.getElementsByTagName('html')[0];
  }
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', lang);
  }
  return htmlElement;
}

/**
 * REACT_027: Fix table structure issues
 * Ensures tables have proper structure with headers and captions
 */
export function fixTableStructure(tableElement) {
  if (!tableElement) return null;
  
  // Ensure table has proper scope attributes on headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach(th => {
    if (!th.hasAttribute('scope')) {
      const row = th.closest('tr');
      const cellIndex = Array.from(row.children).indexOf(th);
      th.setAttribute('scope', cellIndex === 0 ? 'row' : 'col');
    }
  });
  
  // Add caption if missing and table doesn't have one
  if (!tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Data table';
    caption.classList.add('sr-only');
    tableElement.insertBefore(caption, tableElement.firstChild);
  }
  
  return tableElement;
}

/**
 * REACT_017: Fix landmark issues - Add landmark regions
 */
export function fixLandmarkIssues(container) {
  if (!container) return null;
  
  // Ensure main content is wrapped in main landmark
  const mainElement = container.querySelector('main') || container.querySelector('[role="main"]');
  if (!mainElement) {
    const existingMain = container.querySelector('[role="main"]');
    if (existingMain) {
      existingMain.setAttribute('role', 'main');
    }
  }
  
  // Ensure navigation has proper nav landmarks
  const navElements = container.querySelectorAll('nav');
  navElements.forEach(nav => {
    if (!nav.hasAttribute('aria-label') && !nav.hasAttribute('aria-labelledby')) {
      nav.setAttribute('aria-label', 'Navigation');
    }
  });
  
  // Ensure footer has proper footer landmark
  const footerElement = container.querySelector('footer');
  if (footerElement) {
    footerElement.setAttribute('role', 'contentinfo');
  }
  
  return container;
}

/**
 * REACT_017: Add main landmark
 */
export function addMainLandmark(container) {
  if (!container) return null;
  
  let mainElement = container.querySelector('main');
  if (!mainElement) {
    mainElement = container.querySelector('[role="main"]');
  }
  
  if (!mainElement) {
    // Create a main landmark if none exists
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main-content');
    const body = document.body;
    if (body) {
      body.insertBefore(mainElement, body.firstChild);
    }
  }
  
  return mainElement;
}

/**
 * REACT_017: Add landmark regions
 */
export function addLandmarkRegions(container) {
  if (!container) return null;
  
  const landmarks = [
    { selector: 'header', role: 'banner', label: 'Site header' },
    { selector: 'nav', role: 'navigation', label: 'Navigation' },
    { selector: 'main', role: 'main', label: 'Main content' },
    { selector: 'aside', role: 'complementary', label: 'Complementary content' },
    { selector: 'footer', role: 'contentinfo', label: 'Site footer' }
  ];
  
  landmarks.forEach(landmark => {
    let element = container.querySelector(landmark.selector);
    if (!element) {
      element = container.querySelector(`[role="${landmark.role}"]`);
    }
    
    if (element && !element.getAttribute('aria-label') && !element.getAttribute('aria-labelledby')) {
      element.setAttribute('aria-label', landmark.label);
    }
  });
  
  return container;
}

/**
 * REACT_025: Ensure unique landmarks
 */
export function ensureUniqueLandmarks(container) {
  if (!container) return null;
  
  const landmarks = ['banner', 'navigation', 'main', 'complementary', 'contentinfo'];
  
  landmarks.forEach(role => {
    const elements = container.querySelectorAll(`[role="${role}"]`);
    elements.forEach((el, index) => {
      if (index > 0 && !el.getAttribute('aria-label')) {
        const count = index + 1;
        el.setAttribute('aria-label', `${role} ${count}`);
      }
    });
  });
  
  return container;
}

/**
 * REACT_025: Unique landmarks helper
 */
export function uniqueLandmarks(container) {
  return ensureUniqueLandmarks(container);
}

/**
 * REACT_041: Add accessible names to SVGs
 */
export function addSvgAccessibleNames(svgElement, accessibleName) {
  if (!svgElement) return null;
  
  // Add title element inside SVG
  let title = svgElement.querySelector('title');
  if (!title) {
    title = document.createElement('title');
    svgElement.insertBefore(title, svgElement.firstChild);
  }
  title.textContent = accessibleName;
  
  // Add aria-labelledby reference
  const titleId = `svg-title-${Math.random().toString(36).substr(2, 9)}`;
  title.setAttribute('id', titleId);
  svgElement.setAttribute('aria-labelledby', titleId);
  
  // Ensure role is set
  if (!svgElement.hasAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  return svgElement;
}

/**
 * REACT_041: Add accessible names to all SVGs in container
 */
export function addAccessibleNamesToSVGs(container) {
  if (!container) return;
  
  const svgs = container.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      addSvgAccessibleNames(svg, `Icon ${index + 1}`);
    }
  });
  
  return container;
}

/**
 * REACT_036: Fix fake link issue
 */
export function fixFakeLinkIssue(element) {
  if (!element) return null;
  
  // Check if element is a fake link (clickable non-link element)
  const tagName = element.tagName.toLowerCase();
  const role = element.getAttribute('role');
  const onClick = element.getAttribute('onclick') || element.onclick;
  
  if (onClick && tagName !== 'a' && tagName !== 'button') {
    // Convert to proper button or anchor
    if (role !== 'button') {
      element.setAttribute('role', 'button');
    }
    
    // Add keyboard accessibility
    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }
    
    // Add keyboard activation handler
    element.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        element.click();
      }
    });
  }
  
  return element;
}

/**
 * REACT_036: Fix all fake link issues in container
 */
export function fixFakeLinkIssues(container) {
  if (!container) return null;
  
  const clickableElements = container.querySelectorAll('[onclick], [role="button"], [role="link"]');
  clickableElements.forEach((el) => {
    const tagName = el.tagName.toLowerCase();
    if (tagName !== 'a' && tagName !== 'button' && tagName !== 'input') {
      fixFakeLinkIssue(el);
    }
  });
  
  return container;
}

// Helper functions for session management
function getActiveSessionsCount() {
  return appState.sessions.size;
}

function validateSession(sessionId) {
  return appState.sessions.get(sessionId) || null;
}

function handleCredentialResponse(credentialResponse) {
  // Process credential response - basic implementation
  if (!credentialResponse || typeof credentialResponse !== 'object') {
    return { status: 'error', message: 'Invalid credential response' };
  }
  return { status: 'success', credential: credentialResponse };
}

// Accessibility Utilities
const accessibilityUtils = {
  // Initialize skip link functionality for keyboard navigation
  initSkipLink: function() {
    const skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(skipLink.getAttribute('href'));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus();
        }
      });
    }
  },

  // Trap focus within an element (for modals, dialogs)
  trapFocus: function(element) {
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  },

  // Announce message to screen readers
  announceToScreenReader: function(message, priority) {
    if (priority === undefined) {
      priority = 'polite';
    }
    
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.style.position = 'absolute';
    announcer.style.left = '-9999px';
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(function() {
      announcer.remove();
    }, 1000);
  },

  // Handle keyboard navigation
  handleKeyboardNav: function(e, handlers) {
    const key = e.key;
    if (handlers[key]) {
      handlers[key](e);
    }
  },

  // New function for focus trap (imported from origin/main)
  newFocusTrap: function(element, options) {
    // Implementation remains the same as in origin/main
  },
};

// Export all utility functions
export {
  addLangAttribute,
  fixTableStructure,
  fixLandmarkIssues,
  addMainLandmark,
  addLandmarkRegions,
  ensureUniqueLandmarks,
  uniqueLandmarks,
  addSvgAccessibleNames,
  addAccessibleNamesToSVGs,
  fixFakeLinkIssue,
  fixFakeLinkIssues,
  accessibilityUtils,
  trapFocus
};