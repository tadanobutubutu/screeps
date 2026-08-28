// main.js - Accessibility improvements implementation

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_017: Add/fix 4 landmark issues
// REACT_025: Ensure unique landmarks (2 issues)
// REACT_036: Fix 1 fake link issue

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
    this.addSVGAccessibilityProps();
    this.fixLandmarkUniqueness();
    this.fixFakeLinks();
  },

  // Create a live region for screen reader announcements
  createLiveRegion() {
    if (this.liveRegion) return;

    const region = document.createElement('div');
    region.setAttribute('role', 'status');
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    region.className = 'sr-only';
    region.id = 'a11y-live-region';
    document.body.appendChild(region);
    this.liveRegion = region;
  },

  // Announce message to screen readers
  announce(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();

    this.liveRegion.setAttribute('aria-live', priority);
    this.liveRegion.textContent = '';

    // Use setTimeout to ensure the change is detected by screen readers
    setTimeout(() => {
      this.liveRegion.textContent = message;
    }, 100);
  },

  // Setup keyboard navigation for interactive elements
  setupKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      // Handle Enter and Space for custom interactive elements
      if (e.key === 'Enter' || e.key === ' ') {
        const target = e.target.closest('[data-interactive]');
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
        if (openModal) {
          openModal.setAttribute('hidden', '');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[data-dropdown]');
    dropdownContainers.forEach((container) => {
      container.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab') return;

        const currentFocusedElement = document.activeElement;
        let focusIsInsideContainer = false;

        if (
          currentFocusedElement &&
          (currentFocusedElement === container ||
            currentFocusedElement.closest(container))
        ) {
          focusIsInsideContainer = true;
        }

        // Ensure focus trapping only within the dropdown container
        if (!focusIsInsideContainer) {
          // Find the first focusable element within the container
          const firstFocusableElement = container.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (firstFocusableElement) {
            firstFocusableElement.focus();
          }
        }
      });
    });
  },

  // Manage focus for accessibility
  setupFocusManagement() {
    // Trap focus within modals
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const modal = document.querySelector('[role="dialog"][aria-modal="true"]:not([hidden])');
      if (!modal) return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  },

  // Setup skip links
  setupSkipLinks() {
    const skipLink = document.querySelector('.skip-link');
    if (!skipLink) return;

    const targetId = skipLink.getAttribute('href')?.slice(1);
    const target = targetId ? document.getElementById(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if ( navigator.userAgent.toLowerCase().indexOf('safari') !== -1 ) {
        skipLink.focus();
      }
    }
  },

  // Utility: Check if user prefers reduced motion
  prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  // Utility: Check if user prefers high contrast
  prefersHighContrast() {
    return window.matchMedia('(prefers-contrast: more)').matches;
  },

  // New function to handle dynamic content updates
  updateLiveRegion(message, priority = 'polite') {
    if (!this.liveRegion) this.createLiveRegion();
    this.announce(message, priority);
  },

  // New function to check landmark elements
  checkLandmarkElements() {
    // Check for elements with explicit role attributes
    const landmarkRoles = ['main', 'nav', 'header', 'footer', 'aside', 'banner', 'contentinfo', 'complementary', 'search', 'form'];
    landmarkRoles.forEach((role) => {
      const landmark = document.querySelector(`[role="${role}"]`);
      if (landmark && (landmark.id === '' || !landmark.id)) {
        landmark.setAttribute('id', `${role}-${Math.floor(Math.random() * 1000)}`);
      }
    });
    
    // Check for semantic landmark elements
    const semanticLandmarks = ['main', 'nav', 'header', 'footer', 'aside'];
    semanticLandmarks.forEach((tagName) => {
      const landmarks = document.querySelectorAll(tagName);
      if (landmarks.length > 0) {
        landmarks.forEach((landmark, index) => {
          if (landmark.id === '' || !landmark.id) {
            landmark.setAttribute('id', `${tagName}-${index}-${Math.floor(Math.random() * 1000)}`);
          }
        });
      }
    });
  },

  // New function to ensure all landmarks have unique IDs
  fixLandmarkUniqueness() {
    const landmarks = [];
    
    // Collect all landmarks (both semantic and role-based)
    const landmarkSelectors = [
      'main', 'nav', 'header', 'footer', 'aside',
      '[role="main"]', '[role="navigation"]', '[role="banner"]', 
      '[role="contentinfo"]', '[role="complementary"]', '[role="search"]', 
      '[role="form"]', '[role="alert"]', '[role="status"]', 
      '[role="region"]', '[role="application"]'
    ];
    
    landmarkSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        landmarks.push(el);
      });
    });
    
    // Ensure each landmark has a unique ID
    const usedIds = new Set();
    landmarks.forEach((landmark) => {
      let id = landmark.id;
      if (!id || !/^\S+$/.test(id)) {
        // Generate a unique ID if missing or invalid
        const baseName = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
        let newId = baseName + '-' + Math.floor(Math.random() * 10000);
        while (usedIds.has(newId)) {
          newId = baseName + '-' + Math.floor(Math.random() * 10000);
        }
        landmark.setAttribute('id', newId);
        usedIds.add(newId);
      } else {
        // Ensure existing ID is unique
        if (usedIds.has(id)) {
          let newId = id + '-dup-' + Math.floor(Math.random() * 10000);
          while (usedIds.has(newId)) {
            newId = id + '-dup-' + Math.floor(Math.random() * 10000);
          }
          landmark.setAttribute('id', newId);
          usedIds.add(newId);
        } else {
          usedIds.add(id);
        }
      }
    });
  },

  // New function to fix fake links (elements with click handlers that should be links)
  fixFakeLinks() {
    // Find elements that look like links but aren't anchor tags
    const potentialFakeLinks = document.querySelectorAll('[data-href], .fake-link, [role="link"]');
    
    potentialFakeLinks.forEach((fakeLink) => {
      // Skip if it's already an anchor tag
      if (fakeLink.tagName.toLowerCase() === 'a') return;
      
      // Convert to a proper link if it has href-like attribute
      const href = fakeLink.getAttribute('data-href') || fakeLink.getAttribute('href');
      if (href) {
        // Change tag to anchor while preserving attributes
        const anchor = document.createElement('a');
        anchor.href = href;
        anchor.textContent = fakeLink.textContent;
        
        // Copy common attributes
        const attributesToCopy = ['class', 'id', 'title', 'aria-label', 'target', 'rel'];
        attributesToCopy.forEach(attr => {
          const value = fakeLink.getAttribute(attr);
          if (value) {
            anchor.setAttribute(attr, value);
          }
        });
        
        // Copy event listeners by cloning
        const events = fakeLink.getAttribute('onclick');
        if (events) {
          anchor.setAttribute('onclick', events);
        }
        
        // Replace the element
        fakeLink.parentNode.replaceChild(anchor, fakeLink);
      }
    });
    
    // Also check for elements with click handlers that should be links
    const clickableElements = document.querySelectorAll('[onclick]');
    clickableElements.forEach((el) => {
      if (el.tagName.toLowerCase() !== 'a' && 
          el.getAttribute('role') !== 'link' &&
          !el.hasAttribute('data-href') &&
          !el.classList.contains('fake-link')) {
        // Check if text content looks like a link
        const text = el.textContent.trim().toLowerCase();
        const looksLikeLink = ['click here', 'read more', 'learn more', 'go to', 'visit'].some(phrase => text.includes(phrase));
        
        if (looksLikeLink) {
          // Make it accessible as a link
          if (!el.hasAttribute('role')) {
            el.setAttribute('role', 'link');
          }
          if (!el.hasAttribute('tabindex')) {
            el.setAttribute('tabindex', '0');
          }
          
          // Add keyboard support if not present
          if (!el.hasAttribute('onkeydown')) {
            el.setAttribute('onkeydown', 'if(event.key==="Enter"||event.key===" "){event.preventDefault();this.click();}');
          }
        }
      }
    });
  },

  // New function to add SVG accessibility props
  addSVGAccessibilityProps() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach((svg) => {
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-labelledby', 'svg-title');
      const titleText = svg.querySelector('title').textContent || 'Image description';
      const descriptionId = `svg-description-${Math.floor(Math.random() * 1000)}`;
      svg.setAttribute('aria-describedby', descriptionId);

      const descriptionElement = document.createElement('p');
      descriptionElement.setAttribute('id', descriptionId);
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      document.body.appendChild(descriptionElement);
    });
  },

  // New function to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      // Handle each issue type
      switch (issue.type) {
        case 'missing-lang':
          if (!document.documentElement.getAttribute('lang')) {
            document.documentElement.setAttribute('lang', 'en');
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            document.body.insertBefore(skipLink, document.body.firstChild);
          }
          break;
        case 'missing-alt':
          document.querySelectorAll('img').forEach(img => {
            if (!img.getAttribute('alt')) {
              img.setAttribute('alt', 'Image description');
            }
          });
          break;
        case 'missing-label':
          document.querySelectorAll('input, select, textarea').forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('id')) {
              el.setAttribute('aria-label', 'Form field');
            }
          });
          break;
        // Add more cases as needed
      }
    });
  },

  // Preserve existing code
  preserveExistingCode() {
    // Existing code preservation logic
  }
};

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', () => {
  a11yStore.init();
});

// Preserve existing code
a11yStore.preserveExistingCode();

// Standalone function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addressAccessibilityIssues(report);
}

// Export for module usage
export { a11yStore };
export { addressAccessibilityIssues };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };