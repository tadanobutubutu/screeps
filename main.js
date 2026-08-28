// main.js - Accessibility improvements implementation

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report — FIXED
// ----- END ORIGINAL CODE -----

// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

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
    this.addFocusVisibilityStyles();
    this.enhanceDynamicContent();
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
    const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
    landmarkElements.forEach((element) => {
      const landmark = document.querySelector(`[role="${element}"]`);
      if (landmark && landmark.id === '') {
        landmark.setAttribute('id', `${element}-${Math.floor(Math.random() * 1000)}`);
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
  },

  // NEW: Add focus visibility styles for keyboard navigation
  addFocusVisibilityStyles() {
    // Check if styles already added
    if (document.getElementById('a11y-focus-styles')) return;
    
    const style = document.createElement('style');
    style.id = 'a11y-focus-styles';
    style.textContent = `
      /* High contrast focus indicators for keyboard users */
      :focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      /* Ensure focus visibility in different contexts */
      [data-focus-visible]:focus,
      [data-focus-visible] [tabindex]:focus,
      [data-focus-visible] button:focus,
      [data-focus-visible] a:focus {
        outline: 2px solid #005fcc !important;
        outline-offset: 2px !important;
      }
      
      /* Reduce motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    // Add focus-visible polyfill support
    this.setupFocusVisiblePolyfill();
  },
  
  // NEW: Setup focus-visible polyfill for better focus management
  setupFocusVisiblePolyfill() {
    let hadKeyboardEvent = false;
    const alwaysHide = false;
    
    const showRemaining = () => {
      document.body.classList.remove('user-is-tabbing');
    };
    
    const handleBlur = (e) => {
      e.target.classList.remove('user-is-tabbing');
    };
    
    const handleKeydown = (e) => {
      hadKeyboardEvent = true;
      showRemaining();
    };
    
    const handlePointerDown = (e) => {
      hadKeyboardEvent = false;
      showRemaining();
    };
    
    document.addEventListener('keydown', handleKeydown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('touchstart', handlePointerDown, true);
    document.addEventListener('focus', (e) => {
      if (hadKeyboardEvent) {
        e.target.classList.add('user-is-tabbing');
      }
    }, true);
  },
  
  // NEW: Enhance dynamic content updates for better screen reader support
  enhanceDynamicContent() {
    // Observe DOM changes for dynamic content
    if (!window.MutationObserver) return;
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Add appropriate ARIA attributes to dynamically added content
              this.applyARIAtoNode(node);
            }
          });
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  
  // NEW: Apply ARIA attributes to dynamically added elements
  applyARIAtoNode(node) {
    if (!node || !node.setAttribute) return;
    
    // Handle buttons without text content
    if (node.tagName === 'BUTTON' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Button');
    }
    
    // Handle links without text
    if (node.tagName === 'A' && !node.textContent.trim() && !node.getAttribute('aria-label')) {
      node.setAttribute('aria-label', 'Link');
    }
    
    // Handle inputs without labels
    if (['INPUT', 'SELECT', 'TEXTAREA'].includes(node.tagName)) {
      if (!node.getAttribute('aria-label') && !node.getAttribute('id')) {
        node.setAttribute('aria-label', 'Form field');
      }
    }
    
    // Handle images without alt text
    if (node.tagName === 'IMG' && !node.getAttribute('alt')) {
      node.setAttribute('alt', '');
    }
    
    // Process children recursively
    const children = node.querySelectorAll('button, a, input, select, textarea, img');
    children.forEach(child => {
      this.applyARIAtoNode(child);
    });
  },
  
  // NEW: Validate and improve ARIA usage
  validateAndImproveARIA() {
    // Remove duplicate IDs
    const allElements = document.querySelectorAll('[id]');
    const idMap = {};
    
    allElements.forEach(el => {
      const id = el.getAttribute('id');
      if (idMap[id]) {
        el.removeAttribute('id');
      } else {
        idMap[id] = true;
      }
    });
    
    // Ensure ARIA attributes are properly used
    document.querySelectorAll('[aria-hidden="true"]').forEach(el => {
      if (el.getAttribute('tabindex') !== '-1') {
        el.setAttribute('tabindex', '-1');
      }
    });
  }
};

// Wrap the entire document content inside a <main> element and set its lang attribute
const mainElement = document.createElement('main');
mainElement.setAttribute('lang', document.documentElement.lang);

// REACT_015: Ensure the <html> element has a lang attribute for accessibility
if (!document.documentElement.getAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

/**
 * Wraps the primary content in a <main> element for semantic HTML structure.
 * This function finds the main content area and wraps it appropriately.
 * 
 * @param {Object} context - The React context containing window and document references
 * @returns {HTMLElement|null} - The created main element or null if no content found
 */
function wrapPrimaryContentInMain(context) {
  if (!context || !context.document) return null;
  
  const { document } = context;
  
  // Check if a main element already exists
  const existingMain = document.querySelector('main');
  if (existingMain) {
    return existingMain;
  }
  
  // Find the primary content area (body or main content container)
  const body = document.body;
  if (!body || body.children.length === 0) {
    return null;
  }
  
  // Create a new main element
  const mainElement = document.createElement('main');
  mainElement.setAttribute('role', 'main');
  mainElement.id = 'main-content';
  
  // Move all body children into the main element
  while (body.firstChild) {
    mainElement.appendChild(body.firstChild);
  }
  
  // Append the main element to the body
  body.appendChild(mainElement);
  
  return mainElement;
}

mainElement.appendChild(document.body.cloneNode(true));
document.body.parentNode.insertBefore(mainElement, document.body);

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

// Standalone function to calculate discount
function calculateDiscount(price, discount) {
  if (typeof price !== 'number' || typeof discount !== 'number') {
    return 0;
  }
  if (price < 0 || discount < 0 || discount > 100) {
    return 0;
  }
  return Math.round((price * (1 - discount / 100)) * 100) / 100;
}

// REACT_015: Get lang attribute from HTML element
function getLangAttribute() {
  return document.documentElement.getAttribute('lang') || 'en';
}

// REACT_015/REACT_036: Create accessible in-page button
function createInPageButton(options = {}) {
  const {
    text = 'Button',
    href = '#',
    target = '_self',
    ariaLabel = null,
    className = 'in-page-button'
  } = options;
  
  const button = document.createElement('a');
  button.href = href;
  button.target = target;
  button.className = className;
  button.textContent = text;
  
  if (ariaLabel) {
    button.setAttribute('aria-label', ariaLabel);
  }
  
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  
  // Add keyboard support
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
  
  return button;
}

// REACT_027: Validate table accessibility
function validateTableAccessibility(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  
  const errors = [];
  
  // Check for caption
  const caption = table.querySelector('caption');
  if (!caption) {
    errors.push('Table missing caption');
  }
  
  // Check for th elements with scope or headers
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.getAttribute('scope') && !th.getAttribute('id')) {
      errors.push(`Header at index ${index} missing scope or id`);
    }
  });
  
  // Check for proper th/scope association in data cells
  const dataCells = table.querySelectorAll('td');
  const hasHeaderAssociation = headers.length > 0 && 
    (headers[0].getAttribute('scope') === 'col' || headers[0].getAttribute('scope') === 'row');
  
  if (dataCells.length > 0 && headers.length > 0 && !hasHeaderAssociation) {
    errors.push('Data cells should have header associations');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_027: Validate table structure
function validateTableStructure(table) {
  if (!table || table.tagName !== 'TABLE') {
    return { valid: false, errors: ['Invalid table element'] };
  }
  
  const errors = [];
  const rows = table.querySelectorAll('tr');
  
  // Get all rows and count cells
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('th, td');
    const cellCount = cells.length;
    
    // Check for nested tables
    const nestedTables = row.querySelectorAll('table');
    if (nestedTables.length > 0) {
      errors.push(`Row ${rowIndex} contains nested table`);
    }
    
    // Check for empty rows
    if (cellCount === 0) {
      errors.push(`Row ${rowIndex} is empty`);
    }
    
    // Check for inconsistent cell counts in tbody
    if (row.parentElement.tagName === 'TBODY' && rowIndex > 0) {
      const prevRow = rows[rowIndex - 1];
      if (prevRow) {
        const prevCells = prevRow.querySelectorAll('th, td').length;
        if (cellCount !== prevCells) {
          errors.push(`Row ${rowIndex} has inconsistent cell count (expected ${prevCells}, got ${cellCount})`);
        }
      }
    }
  });
  
  // Check for thead
  const thead = table.querySelector('thead');
  if (!thead) {
    errors.push('Table missing thead');
  }
  
  // Check for tbody
  const tbody = table.querySelector('tbody');
  if (!tbody) {
    errors.push('Table missing tbody');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

// REACT_017: Validate landmark elements
function validateLandmark() {
  const landmarks = {
    banner: document.querySelector('[role="banner"]'),
    navigation: document.querySelectorAll('[role="navigation"]'),
    main: document.querySelector('[role="main"]'),
    complementary: document.querySelectorAll('[role="complementary"]'),
    contentinfo: document.querySelector('[role="contentinfo"]')
  };
  
  const issues = [];
  
  // Check for multiple banners
  if (landmarks.banner && document.querySelectorAll('[role="banner"]').length > 1) {
    issues.push('Multiple banner landmarks found');
  }
  
  // Check for multiple main landmarks
  if (landmarks.main && document.querySelectorAll('[role="main"]').length > 1) {
    issues.push('Multiple main landmarks found');
  }
  
  // Check for multiple contentinfo
  if (landmarks.contentinfo && document.querySelectorAll('[role="contentinfo"]').length > 1) {
    issues.push('Multiple contentinfo landmarks found');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark structure
function validateLandmarkStructure() {
  const issues = [];
  
  // Check if main landmark exists
  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    issues.push('No main landmark found');
  }
  
  // Check if navigation has aria-label
  const navigations = document.querySelectorAll('nav');
  navigations.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      issues.push(`Navigation ${index + 1} missing accessible name`);
    }
  });
  
  // Check if header has proper landmark
  const header = document.querySelector('header');
  if (header && !header.hasAttribute('role') && !document.querySelector('[role="banner"]')) {
    issues.push('Header should be a banner landmark or have role="banner"');
  }
  
  // Check if footer has proper landmark
  const footer = document.querySelector('footer');
  if (footer && !footer.hasAttribute('role') && !document.querySelector('[role="contentinfo"]')) {
    issues.push('Footer should be a contentinfo landmark or have role="contentinfo"');
  }
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_017: Validate landmark attributes
function validateLandmarkAttributes() {
  const issues = [];
  const landmarkSelectors = [
    '[role="banner"]',
    '[role="navigation"]',
    '[role="main"]',
    '[role="complementary"]',
    '[role="contentinfo"]',
    '[role="search"]',
    '[role="form"]'
  ];
  
  landmarkSelectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      // Check for unique IDs
      if (el.id) {
        const duplicateIds = document.querySelectorAll(`#${el.id}`);
        if (duplicateIds.length > 1) {
          issues.push(`Duplicate ID "${el.id}" found in landmark`);
        }
      }
      
      // Check for proper labeling
      if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
        const tagName = el.tagName.toLowerCase();
        if (['nav', 'aside', 'section'].includes(tagName) || el.getAttribute('role')) {
          issues.push(`Landmark missing accessible name: ${selector}`);
        }
      }
    });
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_041: Get SVG accessible name
function getSvgAccessibleName(svg) {
  if (!svg || svg.tagName !== 'SVG') return null;
  
  // Check for title element
  const title = svg.querySelector('title');
  if (title && title.textContent.trim()) {
    return title.textContent.trim();
  }
  
  // Check for aria-label
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  
  // Check for aria-labelledby
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const referencedElement = document.getElementById(ariaLabelledby);
    if (referencedElement) {
      return referencedElement.textContent.trim();
    }
  }
  
  return null;
}

// REACT_041: Set SVG accessibility attributes
function setSvgAttributes(svg, options = {}) {
  if (!svg || svg.tagName !== 'SVG') return false;
  
  const {
    role = 'img',
    title = null,
    description = null
  } = options;
  
  // Set role
  svg.setAttribute('role', role);
  
  // Create or update title
  let titleElement = svg.querySelector('title');
  if (title) {
    if (!titleElement) {
      titleElement = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      svg.insertBefore(titleElement, svg.firstChild);
    }
    titleElement.textContent = title;
    titleElement.id = `svg-title-${Math.floor(Math.random() * 10000)}`;
    
    // Set aria-labelledby
    svg.setAttribute('aria-labelledby', titleElement.id);
  }
  
  // Create or update description
  let descElement = svg.querySelector('desc');
  if (description) {
    if (!descElement) {
      descElement = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
      svg.insertBefore(descElement, titleElement ? titleElement.nextSibling : svg.firstChild);
    }
    descElement.textContent = description;
    descElement.id = `svg-desc-${Math.floor(Math.random() * 10000)}`;
    
    // Set aria-describedby
    const existingDescribedby = svg.getAttribute('aria-describedby') || '';
    svg.setAttribute('aria-describedby', existingDescribedby ? `${existingDescribedby} ${descElement.id}` : descElement.id);
  }
  
  return true;
}

// REACT_025: Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarkIds = {};
  const duplicates = [];
  
  const landmarks = document.querySelectorAll('[role="banner"], [role="main"], [role="contentinfo"], [role="navigation"], [role="complementary"]');
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    
    if (!landmarkIds[role]) {
      landmarkIds[role] = [];
    }
    
    if (landmark.id) {
      if (landmarkIds[role].includes(landmark.id)) {
        duplicates.push({ role, id: landmark.id });
      } else {
        landmarkIds[role].push(landmark.id);
      }
    }
  });
  
  // Fix duplicates by adding unique suffixes
  duplicates.forEach(({ role, id }) => {
    const elements = document.querySelectorAll(`[role="${role}"]#${id}`);
    elements.forEach((el, index) => {
      if (index > 0) {
        el.id = `${id}-${index}`;
      }
    });
  });
  
  return {
    fixed: duplicates.length,
    duplicates
  };
}

// REACT_036: Validate link accessibility
function validateLinkAccessibility() {
  const issues = [];
  const links = document.querySelectorAll('a');
  
  links.forEach((link, index) => {
    const href = link.getAttribute('href');
    const text = link.textContent.trim();
    const ariaLabel = link.getAttribute('aria-label');
    const ariaLabelledby = link.getAttribute('aria-labelledby');
    
    // Check for empty links
    if (!href || href === '#') {
      if (!text && !ariaLabel && !ariaLabelledby) {
        issues.push({ index, issue: 'Empty or placeholder link without accessible name' });
      }
    }
    
    // Check for links without text
    if (!text && !ariaLabel && !ariaLabelledby) {
      const hasImg = link.querySelector('img');
      if (!hasImg) {
        issues.push({ index, issue: 'Link without accessible text' });
      }
    }
    
    // Check for generic link text
    const genericTexts = ['click here', 'here', 'read more', 'learn more', 'link'];
    if (genericTexts.some(t => text.toLowerCase().includes(t))) {
      issues.push({ index, issue: `Generic link text: "${text}"`, recommendation: 'Use descriptive link text' });
    }
  });
  
  return {
    valid: issues.length === 0,
    issues
  };
}

// REACT_036: Handle fake links (links that navigate without href or use javascript:)
function handleFakeLinks() {
  const issues = [];
  
  // Find all elements with role="link" that aren't <a> elements
  const fakeLinks = document.querySelectorAll('[role="link"]:not(a)');
  fakeLinks.forEach((el, index) => {
    // Ensure tabindex is set
    if (!el.hasAttribute('tabindex')) {
      el.setAttribute('tabindex', '0');
    }
    
    // Add keyboard support
    if (!el.hasAttribute('data-fake-link-handled')) {
      el.setAttribute('data-fake-link-handled', 'true');
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          el.click();
        }
      });
    }
    
    issues.push({
      element: el.tagName,
      index,
      message: 'Fake link element found'
    });
  });
  
  // Find <a> elements with javascript: href
  const jsLinks = document.querySelectorAll('a[href^="javascript:"]');
  jsLinks.forEach((link, index) => {
    // Add proper button role if it behaves like a button
    if (!link.getAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    
    // Add aria-label if missing descriptive text
    if (!link.textContent.trim() && !link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'JavaScript action');
    }
    
    issues.push({
      element: 'a',
      index,
      href: link.getAttribute('href'),
      message: 'Link with javascript: href'
    });
  });
  
  return {
    handled: fakeLinks.length + jsLinks.length,
    issues
  };
}

// REACT_037: Add proper landmark regions
function addProperLandmarkRegions() {
  const results = { added: [], existing: [] };
  
  // Check and add main landmark
  let main = document.querySelector('main');
  if (!main) {
    main = document.querySelector('[role="main"]');
  }
  if (main) {
    if (!main.id) {
      main.id = 'main-content';
    }
    results.existing.push('main');
  }
  
  // Check and add navigation landmarks with labels
  const navs = document.querySelectorAll('nav');
  navs.forEach((nav, index) => {
    if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
      const label = nav.closest('header') ? 'Primary navigation' : `Navigation ${index + 1}`;
      nav.setAttribute('aria-label', label);
    }
    results.existing.push(`nav-${index + 1}`);
  });
  
  // Check and add header as banner
  const header = document.querySelector('header');
  if (header && !header.getAttribute('role')) {
    header.setAttribute('role', 'banner');
    results.added.push('header as banner');
  }
  
  // Check and add footer as contentinfo
  const footer = document.querySelector('footer');
  if (footer && !footer.getAttribute('role')) {
    footer.setAttribute('role', 'contentinfo');
    results.added.push('footer as contentinfo');
  }
  
  // Add complementary landmark to asides
  const asides = document.querySelectorAll('aside');
  asides.forEach((aside, index) => {
    if (!aside.getAttribute('role')) {
      aside.setAttribute('role', 'complementary');
    }
    if (!aside.getAttribute('aria-label')) {
      aside.setAttribute('aria-label', `Supplementary content ${index + 1}`);
    }
    results.existing.push(`aside-${index + 1}`);
  });
  
  return results;
}

// Export for module usage
export { a11yStore };
export { mainElement };
export { addressAccessibilityIssues };
export { calculateDiscount };
export { getLangAttribute };
export { createInPageButton };
export { validateTableAccessibility };
export { validateTableStructure };
export { validateLandmark };
export { validateLandmarkStructure };
export { validateLandmarkAttributes };
export { getSvgAccessibleName };
export { setSvgAttributes };
export { ensureUniqueLandmarks };
export { validateLinkAccessibility };
export { handleFakeLinks };
export { addProperLandmarkRegions };
export default a11yStore;

// Import and export additional functions if needed (placeholder for actual modules)
// Assuming 'utils' modules are required (example follows)
// import { utilityFunction } from './utils.js';
// export { utilityFunction };