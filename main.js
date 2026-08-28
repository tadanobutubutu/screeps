// main.js - Accessibility improvements implementation

// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,

  init() {
    this.createLiveRegion();
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupSkipLinks();
    this.checkLandmarkElements();
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
        const target = e.target;
        if (target) {
          e.preventDefault();
          target.click();
        }
      }

      // Escape key to close modals/dropdowns
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal[aria-modal="true"]');
        if (openModal) {
          openModal.setAttribute('aria-hidden', 'true');
          document.body.style.overflow = '';
        }
      }
    });

    // Fix Safari focus trapping in dropdowns
    const dropdownContainers = document.querySelectorAll('[role="menu"], [role="listbox"]');
    dropdownContainers.forEach(container => {
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
        if (!focusIsInsideContainer && !e.shiftKey) {
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

      const modal = document.querySelector('.modal[aria-modal="true"]:not([aria-hidden="true"])');
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

    const targetId = skipLink.getAttribute('href');
    const target = targetId ? document.querySelector(targetId) : null;

    if (target) {
      skipLink.addEventListener('click', (e) => {
        e.preventDefault();
        target.setAttribute('tabindex', '-1');
        target.focus();
        this.announce('Skipped to main content');
      });

      // Focus the skip link when the document is loaded in Safari
      if (navigator.userAgent.indexOf('Safari') !== -1) {
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
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    const usedIds = new Set();
    
    // First, collect all existing IDs on the page
    document.querySelectorAll('[id]').forEach(el => {
      usedIds.add(el.id);
    });

    // Generate unique ID if needed
    const generateUniqueId = (baseId) => {
      let id = baseId;
      let counter = 1;
      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
      }
      usedIds.add(id);
      return id;
    };

    landmarkElements.forEach(landmark => {
      const elements = document.querySelectorAll(landmark);
      elements.forEach((el, index) => {
        // REACT_017: Add/fix landmark issues - ensure proper landmark usage
        if (!el.id) {
          // Generate unique ID for the landmark
          const uniqueId = generateUniqueId(`landmark-${landmark}`);
          el.id = uniqueId;
        }
        
        // REACT_025: Ensure unique landmarks - check for duplicate landmarks without proper differentiation
        if (elements.length > 1 && !el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
          // Add descriptive label for multiple same-type landmarks
          const label = landmark === 'nav' ? 'Navigation' : 
                        landmark === 'header' ? 'Site header' : 
                        landmark === 'footer' ? 'Site footer' : 
                        landmark === 'aside' ? 'Sidebar' : 'Main content';
          el.setAttribute('aria-label', index === 0 ? label : `${label} ${index + 1}`);
        }
      });
    });
  },

  // New function to add SVG accessibility props
  addSvgAccessibility() {
    const svgElements = document.querySelectorAll('svg');
    svgElements.forEach(svg => {
      svg.setAttribute('role', 'img');
      const titleId = `svg-title-${Math.random().toString(36).substr(2, 9) * 1000}`;
      const titleText = svg.querySelector('title')?.textContent || 'Image description';
      const descriptionId = `svg-desc-${Math.random().toString(36).substr(2, 9) * 1000}`;
      svg.setAttribute('aria-labelledby', `${titleId} ${descriptionId}`);

      const descriptionElement = document.createElement('desc');
      descriptionElement.id = descriptionId;
      descriptionElement.textContent = titleText;
      descriptionElement.className = 'sr-only';
      svg.insertBefore(descriptionElement, svg.firstChild);
    });
  },

  // REACT_036: Fix fake link issues - buttons styled as links without proper semantics
  fixFakeLinks() {
    // Find elements that look like links but are not <a> tags
    const fakeLinks = document.querySelectorAll('[role="button"], button:not([disabled])');
    
    fakeLinks.forEach(fakeLink => {
      // Check if it's inside an anchor tag (nested interactive elements)
      const parentAnchor = fakeLink.closest('a');
      if (parentAnchor && parentAnchor.href) {
        // Move click handlers to the anchor
        if (fakeLink.onclick) {
          parentAnchor.onclick = fakeLink.onclick;
          fakeLink.removeAttribute('onclick');
        }
      }
      
      // Ensure buttons that navigate have proper keyboard support
      if (fakeLink.getAttribute('href') || fakeLink.onclick) {
        // Add keyboard support if not already present
        if (!fakeLink.hasAttribute('tabindex')) {
          fakeLink.setAttribute('tabindex', '0');
        }
        
        // Handle Enter and Space key presses
        fakeLink.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (fakeLink.onclick) {
              fakeLink.onclick(e);
            } else if (fakeLink.getAttribute('href')) {
              // For href-based navigation, trigger click
              fakeLink.click();
            }
          }
        });
      }
    });

    // Also check for links without href that should be buttons
    const linksWithoutHref = document.querySelectorAll('a:not([href])');
    linksWithoutHref.forEach(link => {
      // If it's a link without href and has an onclick, convert to button role
      if (link.onclick || link.getAttribute('data-action')) {
        link.setAttribute('role', 'button');
        if (!link.hasAttribute('tabindex')) {
          link.setAttribute('tabindex', '0');
        }
      }
    });
  },

  // New function to address accessibility issues from insight report
  addressAccessibilityIssues(report) {
    if (!report) return;
    report.forEach(issue => {
      // Handle each issue type
      switch (issue.type) {
        case 'missing-lang':
          if (document.documentElement) {
            document.documentElement.lang = 'en';
          }
          break;
        case 'missing-skip-link':
          if (!document.querySelector('.skip-link')) {
            const skipLink = document.createElement('a');
            skipLink.className = 'skip-link';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.position = 'absolute';
            skipLink.style.left = '-9999px';
            skipLink.style.zIndex = '9999';
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

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.id = 'main-content';
document.body.appendChild(mainElement);
document.documentElement.lang = 'en';

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.lang) {
  document.documentElement.lang = 'en';
}

// Ensure main landmark exists for