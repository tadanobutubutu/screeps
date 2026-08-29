const dependencyGraphContent = require('./dependencyGraphContent');

// TODO: Add back any required exports that might have been?

function main() {
  return "Hello, World!";
}

const version = "1.0.0";

const config = {
  port: 3000,
  debug: false
};

const app = {
  // Main application entry point
  start() {
    console.log('Application started');
  }
};

const logger = {
  info(message) {
    console.log(`[INFO] ${message}`);
  },
  error(message) {
    console.error(`[ERROR] ${message}`);
  }
};

// Function to handle REACT_015: Add lang attribute to HTML element
function getLangAttribute() {
  // Code to get the language and return it
  // Placeholder example:
  return 'en';
}

function getFullLangAttribute() {
  // Code to get full localized language and return it
  // Placeholder example:
  return 'en-US';
}

// New function: validateTableStructure
function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Check if table has a caption, thead, thead > tr, tbody, tfoot, th, td
    const hasCaption = table.querySelector('caption');
    const hasThead = table.querySelector('thead');
    const rowsInThead = hasThead ? hasThead.querySelectorAll('tr') : [];
    const hasTbody = table.querySelector('tbody');
    const hasTfoot = table.querySelector('tfoot');
    const hasTh = table.querySelectorAll('th');
    const hasTd = table.querySelectorAll('td');

    // Check if the caption is before the thead, thead before tbody, and tbody before tfoot
    if (hasCaption) {
      if (table.firstChild !== hasCaption) {
        throw new Error('Table caption should be the first child of the table');
      }
    }
    if (hasThead) {
      if (hasThead !== (hasCaption ? hasCaption.nextElementSibling : table.firstChild)) {
        throw new Error('Thead should be before the tbody');
      }
    }
    if (hasTbody && hasThead) {
      if (hasTbody !== hasThead.nextElementSibling) {
        throw new Error('Tbody should be immediately after thead');
      }
    }
    if (hasTfoot && hasTbody) {
      if (hasTfoot !== hasTbody.nextElementSibling) {
        throw new Error('Tfoot should be immediately after tbody');
      }
    }

    // Check if all thead columns have a corresponding tbody column and vice versa
    if (hasTh.length > 0 && rowsInThead.length > 0) {
      rowsInThead.forEach((row, index) => {
        const ths = row.querySelectorAll('th');
        const tds = hasTbody ? hasTbody.querySelectorAll(`tr:nth-child(${index + 1}) td`) : [];
        if (ths.length !== tds.length) {
          throw new Error(`Row ${index} in table header should have the same number of th and td`);
        }
      });
    }
  });
}

// New function: validateLandmark
function validateLandmark(element, landmarkType) {
  // Check if the specified element is a landmark (using given landmarkType)
  // You may use a library like "axe-core" for more reliable checks considering the various landmark roles.
  // For the sake of simplicity, this example will check only for presence of ARIA attributes, but a more accurate solution would involve verified matching with the given landmarkType.
  // If the element is not a valid landmark of the requested type, throw an error with a message.
  const role = element.getAttribute('role');
  if (!role || role !== landmarkType) {
    throw new Error(`Element is not a valid ${landmarkType} landmark`);
  }
}

// New function: validateLandmarkStructure
function validateLandmarkStructure() {
  // Check for required landmarks and proper structure
  const mainLandmark = document.querySelector('[role="main"], main');
  if (!mainLandmark) {
    throw new Error('Document must have a main landmark (role="main" or <main> element)');
  }

  // Check for duplicate banners
  const banners = document.querySelectorAll('[role="header"]');
  if (banners.length > 1) {
    throw new Error('Document should have at most one banner or header landmark');
  }

  // Check for duplicate contentinfo
  const contentinfos = document.querySelectorAll('[role="footer"]');
  if (contentinfos.length > 1) {
    throw new Error('Document should have at most one contentinfo or footer landmark');
  }

  // Check for nested landmarks of the same type
  const allLandmarks = document.querySelectorAll('[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], [role="main"], [role="navigation"], [role="search"], [role="region"], [role="article"], [role="aside"], [role="figure"], [role="footer"], [role="header"], [role="landmark"], main, header, footer, aside, nav, section[aria-label], form[aria-label]');

  allLandmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    let parent = landmark.parentElement;
    while (parent) {
      const parentRole = parent.getAttribute('role') || parent.tagName.toLowerCase();
      if (parentRole === role) {
        throw new Error(`Landmark with role "${role}" should not be nested inside another with the same role`);
      }
      parent = parent.parentElement;
    }
  });
}

// New function: getSvgAccessibleName
function getSvgAccessibleName(svgElement) {
  // Check for aria-label
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }
  // Check for aria-labelledby
  if (svgElement.getAttribute('aria-labelledby')) {
    const ids = svgElement.getAttribute('aria-labelledby').split(' ');
    let labels = [];
    ids.forEach(id => {
      const labelElement = document.getElementById(id);
      if (labelElement) {
        labels.push(labelElement.textContent);
      }
    });
    if (labels.length > 0) {
      return labels.join(' ');
    }
  }
  // Check for title element
  const title = svgElement.querySelector('title');
  if (title) {
    return title.textContent.trim();
  }
  // Check for desc element (often used as description, but can be used as name)
  const desc = svgElement.querySelector('desc');
  if (desc) {
    return desc.textContent.trim();
  }
  // Fallback to text content
  return svgElement.textContent.trim() || '';
}

// Placeholder functions for missing exports
function newFunction() {
  // Placeholder implementation
  return 'new function placeholder';
}

function totalDependencies() {
  // Placeholder implementation
  return 0;
}

function addressAccessibilityIssue(issue, element) {
  // Placeholder implementation
  console.log(`Addressing issue ${issue} for element:`, element);
}

// Implement the function for addressing the new accessibility issues
function addressAccessibilityIssues() {
  validateTableStructure();
  validateLandmarkStructure();
  // Additional accessibility issue handling can be added here
}

// Create the new placeholder functions for accessibility handling
const newAccessibilityFunction = () => {
  return 'new accessibility function';
};

// Export the old function to address accessibility issues
function addressOldAccessibilityIssues() {
  return 'addressing old issues';
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement) return;
  
  // Add role="img" if not present
  if (!svgElement.getAttribute('role')) {
    svgElement.setAttribute('role', 'img');
  }
  
  // Ensure the SVG has an accessible name
  const accessibleName = getSvgAccessibleName(svgElement);
  if (!accessibleName && !svgElement.getAttribute('aria-label') && !svgElement.getAttribute('aria-labelledby')) {
    // Add a generated accessible name if none exists
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Decorative SVG';
    svgElement.insertBefore(title, svgElement.firstChild);
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  if (!link) return false;
  
  const href = link.getAttribute('href');
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');
  const hasAriaLabelledby = link.getAttribute('aria-labelledby');
  const hasTitle = link.getAttribute('title');
  
  // Link is accessible if it has text or an accessible name
  return hasText || hasAriaLabel || hasAriaLabelledby || hasTitle;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  if (!button) return false;
  
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledby = button.getAttribute('aria-labelledby');
  const hasTitle = button.getAttribute('title');
  const hasValue = button.value && button.value.trim().length > 0;
  
  // Button is accessible if it has text or an accessible name
  return hasText || hasAriaLabel || hasAriaLabelledby || hasTitle || hasValue;
}

/**
 * Checks link and button accessibility in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing accessibility check results
 */
function checkAccessibility(container = document) {
  const results = {
    links: [],
    buttons: [],
    inaccessibleLinks: [],
    inaccessibleButtons: []
  };
  
  const links = container.querySelectorAll('a');
  const buttons = container.querySelectorAll('button');
  
  links.forEach(link => {
    const isAccessible = isLinkAccessible(link);
    results.links.push({ element: link, accessible: isAccessible });
    if (!isAccessible) {
      results.inaccessibleLinks.push(link);
    }
  });
  
  buttons.forEach(button => {
    const isAccessible = isButtonAccessible(button);
    results.buttons.push({ element: button, accessible: isAccessible });
    if (!isAccessible) {
      results.inaccessibleButtons.push(button);
    }
  });
  
  return results;
}

function initializeApp() {
  return {
    ready: true,
    version: '1.0.0'
  };
}

// REACT_025: Additional accessibility functions per insight report

/**
 * Validates heading structure for proper hierarchy (h1-h6)
 * @param {HTMLElement} [container=document] - Container to validate
 * @returns {Object} Validation results
 */
function validateHeadingStructure(container = document) {
  const results = {
    valid: true,
    headings: [],
    errors: []
  };
  
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1), 10);
    results.headings.push({
      element: heading,
      level,
      text: heading.textContent.trim()
    });
    
    // Check for skipped heading levels
    if (previousLevel > 0 && level > previousLevel + 1) {
      results.valid = false;
      results.errors.push({
        type: 'skipped-level',
        message: `Heading level skipped from h${previousLevel} to h${level}`,
        element: heading
      });
    }
    
    // Check for missing h1
    if (index === 0 && level !== 1) {
      results.valid = false;
      results.errors.push({
        type: 'missing-h1',
        message: 'Document should start with an h1 heading',
        element: heading
      });
    }
    
    previousLevel = level;
  });
  
  // Check for multiple h1s
  const h1Count = results.headings.filter(h => h.level === 1).length;
  if (h1Count > 1) {
    results.valid = false;
    results.errors.push({
      type: 'multiple-h1',
      message: 'Document should have only one h1 heading',
      count: h1Count
    });
  }
  
  return results;
}

/**
 * Validates that all images have appropriate alt text
 * @param {HTMLElement} [container=document] - Container to validate
 * @returns {Object} Validation results
 */
function validateImageAltText(container = document) {
  const results = {
    valid: true,
    images: [],
    errors: []
  };
  
  const images = container.querySelectorAll('img');
  
  images.forEach(img => {
    const alt = img.getAttribute('alt');
    const hasAlt = alt !== null;
    const isDecorative = alt === '';
    const hasRolePresentation = img.getAttribute('role') === 'presentation';
    
    results.images.push({
      element: img,
      src: img.getAttribute('src'),
      alt: alt,
      hasAlt,
      isDecorative
    });
    
    if (!hasAlt && !hasRolePresentation) {
      results.valid = false;
      results.errors.push({
        type: 'missing-alt',
        message: 'Image is missing alt attribute',
        element: img
      });
    } else if (hasAlt && alt.length > 125) {
      results.errors.push({
        type: 'alt-too-long',
        message: 'Alt text should be concise (under 125 characters)',
        element: img
      });
    }
  });
  
  return results;
}

/**
 * Validates form labels and associations
 * @param {HTMLElement} [container=document] - Container to validate
 * @returns {Object} Validation results
 */
function validateFormLabels(container = document) {
  const results = {
    valid: true,
    inputs: [],
    errors: []
  };
  
  const inputs = container.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    if (input.type === 'hidden') return;
    
    const id = input.getAttribute('id');
    const ariaLabel = input.getAttribute('aria-label');
    const ariaLabelledby = input.getAttribute('aria-labelledby');
    const title = input.getAttribute('title');
    let label = null;
    
    if (id) {
      label = container.querySelector(`label[for="${id}"]`);
    }
    
    const hasLabel = label || ariaLabel || ariaLabelledby || title;
    
    results.inputs.push({
      element: input,
      type: input.type,
      id,
      hasLabel,
      label: label ? label.textContent.trim() : ariaLabel || ariaLabelledby || title
    });
    
    if (!hasLabel) {
      results.valid = false;
      results.errors.push({
        type: 'missing-label',
        message: `Form input (${input.type}) is missing an associated label`,
        element: input
      });
    }
  });
  
  return results;
}

/**
 * Focus management utilities
 */
const focusManager = {
  /**
   * Traps focus within a container
   * @param {HTMLElement} container - Container to trap focus in
   * @returns {Function} Cleanup function to remove trap
   */
  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    function handleTab(e) {
      if (e.key !== 'Tab') return;
      
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
    
    container.addEventListener('keydown', handleTab);
    firstElement?.focus();
    
    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  },
  
  /**
   * Restores focus to a previously focused element
   * @param {HTMLElement} element - Element to focus
   */
  restoreFocus(element) {
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  },
  
  /**
   * Gets the currently focused element
   * @returns {HTMLElement|null}
   */
  getFocusedElement() {
    return document.activeElement;
  }
};

/**
 * Announces message to screen readers via ARIA live region
 * @param {string} message - Message to announce
 * @param {'polite' | 'assertive'} [priority='polite'] - Priority level
 */
function announceToScreenReader(message, priority = 'polite') {
  const announcer = document.getElementById('a11y-announcer') || createAnnouncer();
  announcer.setAttribute('aria-live', priority);
  announcer.textContent = '';
  // Force reflow to ensure announcement
  setTimeout(() => {
    announcer.textContent = message;
  }, 50);
}

function createAnnouncer() {
  const announcer = document.createElement('div');
  announcer.id = 'a11y-announcer';
  announcer.setAttribute('role', 'status');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.style.position = 'absolute';
  announcer.style.left = '-9999px';
  announcer.style.width = '1px';
  announcer.style.height = '1px';
  announcer.style.overflow = 'hidden';
  document.body.appendChild(announcer);
  return announcer;
}

/**
 * Validates color contrast (basic check - for full compliance use a dedicated library)
 * @param {string} foreground - Foreground color (hex, rgb, etc.)
 * @param {string} background - Background color (hex, rgb, etc.)
 * @param {Object} [options] - Options for validation
 * @param {number} [options.ratio=4.5] - Minimum contrast ratio
 * @param {boolean} [options.largeText=false] - Whether text is large (18pt+ or 14pt+ bold)
 * @returns {Object} Contrast validation results
 */
function validateColorContrast(foreground, background, options = {}) {
  const { ratio = 4.5, largeText = false } = options;
  const minRatio = largeText ? 3 : ratio;
  
  // Parse colors to RGB
  const parseColor = (color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
  };
  
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  
  // Calculate luminance
  const luminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };
  
  const fgLum = luminance(fg[0], fg[1], fg[2]);
  const bgLum = luminance(bg[0], bg[1], bg[2]);
  
  const contrastRatio = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  
  return {
    ratio: Math.round(contrastRatio * 100) / 100,
    passed: contrastRatio >= minRatio,
    minRatio,
    foreground,
    background
  };
}

/**
 * Adds a skip link to the page
 * @param {Object} options - Skip link options
 * @param {string} [options.target='#main'] - Target selector
 * @param {string} [options.text='Skip to main content'] - Link text
 * @returns {HTMLAnchorElement} The created skip link
 */
function addSkipLink(options = {}) {
  const { target = '#main', text = 'Skip to main content' } = options;
  
  // Check if skip link already exists
  if (document.querySelector('.skip-link')) {
    return document.querySelector('.skip-link');
  }
  
  const skipLink = document.createElement('a');
  skipLink.href = target;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.style.cssText = `
    position: absolute;
    top: -100%;
    left: 50%;
    transform: translateX(-50%);
    background: #000;
    color: #fff;
    padding: 1rem 2rem;
    z-index: 10000;
    text-decoration: none;
    font-weight: bold;
  `;
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '0';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-100%';
  });
  
  // Insert at the beginning of body
  document.body.insertBefore(skipLink, document.body.firstChild);
  
  return skipLink;
}

/**
 * Validates keyboard accessibility for interactive elements
 * @param {HTMLElement} [container=document] - Container to validate
 * @returns {Object} Validation results
 */
function validateKeyboardAccessibility(container = document) {
  const results = {
    valid: true,
    elements: [],
    errors: []
  };
  
  const interactiveElements = container.querySelectorAll(
    'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"], [role="link"], [role="menuitem"]'
  );
  
  interactiveElements.forEach(el => {
    const tabIndex = el.getAttribute('tabindex');
    const isFocusable = tabIndex !== '-1';
    const hasFocusStyle = checkFocusStyles(el);
    const isNativeInteractive = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName);
    const hasRole = el.getAttribute('role');
    
    results.elements.push({
      element: el,
      tagName: el.tagName,
      tabIndex,
      isFocusable,
      hasFocusStyle,
      isNativeInteractive,
      role: hasRole
    });
    
    // Check for non-focusable interactive elements
    if (!isFocusable && !el.hasAttribute('disabled') && !el.hasAttribute('aria-hidden')) {
      results.valid = false;
      results.errors.push({
        type: 'not-focusable',
        message: 'Interactive element is not focusable',
        element: el
      });
    }
    
    // Check for elements with role but no keyboard handlers
    if (hasRole && ['button', 'link', 'menuitem', 'tab'].includes(hasRole) && !isNativeInteractive) {
      const hasKeyHandler = el.onkeydown || el.onkeyup || el.onkeypress;
      if (!hasKeyHandler) {
        results.errors.push({
          type: 'missing-keyboard-handler',
          message: `Element with role="${hasRole}" may need keyboard event handlers`,
          element: el
        });
      }
    }
  });
  
  return results;
}

function checkFocusStyles(element) {
  // Basic check for focus styles - in practice would need computed styles
  const styles = window.getComputedStyle(element, ':focus');
  const focusVisibleStyles = window.getComputedStyle(element, ':focus-visible');
  
  return (
    styles.outline !== 'none' ||
    styles.outlineWidth !== '0px' ||
    styles.boxShadow !== 'none' ||
    focusVisibleStyles.outline !== 'none' ||
    focusVisibleStyles.outlineWidth !== '0px'
  );
}

/**
 * Runs comprehensive accessibility audit
 * @param {HTMLElement} [container=document] - Container to audit
 * @returns {Object} Comprehensive audit results
 */
function runAccessibilityAudit(container = document) {
  return {
    headings: validateHeadingStructure(container),
    images: validateImageAltText(container),
    forms: validateFormLabels(container),
    landmarks: validateLandmarkStructure(container),
    tables: validateTableStructure(container),
    keyboard: validateKeyboardAccessibility(container),
    linksAndButtons: checkAccessibility(container),
    timestamp: new Date().toISOString()
  };
}

// Export all necessary functions and objects
module.exports = {
  app,
  logger,
  getLangAttribute,
  getFullLangAttribute,
  validateTableStructure,
  validateLandmark,
  validateLandmarkStructure,
  getSvgAccessibleName,
  newFunction,
  totalDependencies,
  addressAccessibilityIssue,
  addressAccessibilityIssues,
  newAccessibilityFunction,
  addressOldAccessibilityIssues,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkAccessibility,
  initializeApp,
  dependencyGraphContent,
  main,
  config,
  version,
  // New exports for REACT_025 accessibility enhancements
  validateHeadingStructure,
  validateImageAltText,
  validateFormLabels,
  focusManager,
  announceToScreenReader,
  validateColorContrast,
  addSkipLink,
  validateKeyboardAccessibility,
  runAccessibilityAudit
};