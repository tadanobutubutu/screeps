// Polyfill for Array.prototype.flat (if not available)
if (!Array.prototype.flat) {
  Object.defineProperty(Array.prototype, 'flat', {
    configurable: true,
    writable: true,
    value: function depthFlat(depth = 1) {
      return depth > 0
        ? Array.prototype.reduce.call(this, function (acc, val) {
            return acc.concat(Array.isArray(val) ? val.flat(depth - 1) : val);
          }, [])
        : Array.prototype.slice.call(this);
    }
  });
}

// REACT_015: Add lang attribute to HTML element
document.documentElement.setAttribute('lang', 'en');

// Announce content changes to screen readers
function announceToScreenReader(message, priority = 'polite') {
  // Remove any existing announcements
  const existingAnnouncement = document.querySelector('[role="status"].sr-only-announcement');
  if (existingAnnouncement) {
    existingAnnouncement.remove();
  }

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only-announcement';
  announcement.style.position = 'absolute';
  announcement.style.width = '1px';
  announcement.style.height = '1px';
  announcement.style.padding = '0';
  announcement.style.margin = '-1px';
  announcement.style.overflow = 'hidden';
  announcement.style.clip = 'rect(0, 0, 0, 0)';
  announcement.style.whiteSpace = 'nowrap';
  announcement.style.border = '0';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement is read
  setTimeout(() => {
    if (announcement.parentNode) {
      announcement.remove();
    }
  }, 1000);
}

// Ensure interactive elements are keyboard accessible
function enhanceKeyboardAccessibility(container = document) {
  const interactiveElements = container.querySelectorAll(
    'a[href], button:not([disabled]):not([aria-hidden="true"]), ' +
    'input:not([disabled]):not([type="hidden"]), ' +
    'select:not([disabled]), textarea:not([disabled]), ' +
    '[tabindex]:not([tabindex="-1"])'
  );

  interactiveElements.forEach((element) => {
    // Ensure elements with onclick have keyboard support
    if (element.hasAttribute('onclick') && !element.hasAttribute('role')) {
      if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
        element.setAttribute('role', 'button');
        element.setAttribute('tabindex', '0');
      }
    }

    // Add focus indicator if missing
    if (!element.hasAttribute('data-accessibility-focused')) {
      const style = window.getComputedStyle(element);
      if (style.outline === 'none' || style.outlineWidth === '0px') {
        element.style.outline = '2px solid #0066cc';
        element.style.outlineOffset = '2px';
      }
      element.setAttribute('data-accessibility-focused', 'true');
    }
  });
}

// Trap focus within a container (for modals/dialogs)
function trapFocus(element) {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  element.addEventListener('keydown', function(e) {
    if (e.key === 'Tab' || e.key === 'Shift+Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
    }
  });

  // Set initial focus
  firstFocusable.focus();
}

// Skip link functionality
function setupSkipLink(targetId = 'main-content') {
  const skipLink = document.createElement('a');
  skipLink.href = '#' + targetId;
  skipLink.className = 'skip-link';
  skipLink.textContent = 'Skip to main content';
  
  skipLink.style.position = 'absolute';
  skipLink.style.top = '-40px';
  skipLink.style.left = '0';
  skipLink.style.background = '#000';
  skipLink.style.color = '#fff';
  skipLink.style.padding = '8px 16px';
  skipLink.style.zIndex = '100000';
  skipLink.style.textDecoration = 'none';
  skipLink.style.transition = 'top 0.2s';
  
  skipLink.addEventListener('focus', function() {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', function() {
    skipLink.style.top = '-40px';
  });

  document.body.insertBefore(skipLink, document.body.firstChild);
}

// REACT_017: Add/fix 4 landmark issues - Add main landmark to root element or main content
function addMainLandmark() {
  const rootElement = document.getElementById('root');
  const mainContent = document.getElementById('main-content');
  
  // Prefer main-content element if it exists, otherwise use root element
  if (mainContent && !mainContent.hasAttribute('role')) {
    mainContent.setAttribute('role', 'main');
  } else if (rootElement && !rootElement.hasAttribute('role')) {
    rootElement.setAttribute('role', 'main');
  }
}

// REACT_036: Fix 1 fake link issue - Replace fake links with button role
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('a:not([href])');
  fakeLinks.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
    }
  });
}

// Auto-initialize accessibility features
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setupSkipLink();
      enhanceKeyboardAccessibility();
      addMainLandmark();
      fixFakeLinks();
    });
  } else {
    setupSkipLink();
    enhanceKeyboardAccessibility();
    addMainLandmark();
    fixFakeLinks();
  }
}

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    announceToScreenReader,
    enhanceKeyboardAccessibility,
    trapFocus,
    setupSkipLink,
    addMainLandmark,
    fixFakeLinks
  };
}
```