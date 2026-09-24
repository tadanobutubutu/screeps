// TODO: This is the existing code that needs to be preserved
const { updateThScopeAttribute } = require('./testHelper');

// Landmark elements that should be checked for proper usage
const LANDMARK_ELEMENTS = ['main', 'nav', 'aside', 'header', 'footer', 'section', 'article'];

/**
 * Checks landmark elements in HTML content for accessibility compliance.
 * @param {string} htmlContent - The HTML content to check
 * @returns {Object} - Object containing landmark element information and any warnings
 */
function checkLandmarkElements(htmlContent) {
  const warnings = [];
  const foundLandmarks = {};

  LANDMARK_ELEMENTS.forEach(landmark => {
    const regex = new RegExp(`<${landmark}[^>]*>`, 'gi');
    const matches = htmlContent.match(regex);
    if (matches) {
      foundLandmarks[landmark] = matches.length;
    } else {
      warnings.push(`Missing landmark element: <${landmark}>`);
    }
  });
  return { warnings, foundLandmarks };
}

/**
 * Add lang attribute to HTML element
 */
function addLangAttribute(lang) {
    const htmlElement = document.querySelector('html');
    if (htmlElement) {
        htmlElement.setAttribute('lang', lang);
    }
  });

  if (!foundLandmarks.main) {
    warnings.push('Missing main landmark element');
  }

  return {
    foundLandmarks,
    warnings,
    hasMainLandmark: !!foundLandmarks.main
  };
}

/**
 * Creates an in-page button for the game interface
 * @param {Object} options - Button configuration options
 * @param {string} options.text - The text to display on the button
 * @param {Function} options.onClick - The callback function when button is clicked
 * @param {string} [options.id] - Optional unique identifier for the button
 * @param {string} [options.title] - Optional title/tooltip for the button
 * @param {string} [options.className] - Optional CSS class name for styling
 * @returns {Object} - The created button object
 */
function createInPageButton(options) {
  const { text, onClick, id, title, className } = options;

  // Validate required options
  if (!text) {
    throw new Error('Button text is required');
  }
  if (typeof onClick !== 'function') {
    throw new Error('onClick callback must be a function');
  }

  // Create button object
  const button = {
    id: id || `btn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: String(text),
    title: title || '',
    className: className || 'default-button',
    onClick,
    disabled: false,
    visible: true,
    element: null
  };

  // Store button reference
  if (!createInPageButton.buttons) {
    createInPageButton.buttons = {};
  }
  createInPageButton.buttons[button.id] = button;

  return button;
}

// TODO: Implement a function to count dependencies
function countDependencies() {
  // Existing function implementation
  // New implementation to count dependencies using dependencyGraphContent and regex
  const importCommentRegExp = /\/\/\s*require\s*\(|import\s+.*\s+from\s+['"`]/g;
  const importCount = (dependencyGraphContent || '').match(importCommentRegExp) || [];
  return importCount.length;
}

// Store for accessibility announcements (screen reader support)
const a11yStore = {
  liveRegion: null,
  announcements: [],
  addAnnouncement(message) {
    this.announcements.push({
      message,
      timestamp: Date.now()
    });
  },
  getAnnouncements() {
    return this.announcements;
  },
  clearAnnouncements() {
    this.announcements = [];
  },

// Utility: Check if user prefers reduced motion
function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

// New function to handle dynamic content updates
function updateLiveRegion(message, priority = 'polite') {
  if (!a11yStore.liveRegion) return;
  a11yStore.announce(message, priority);
}

// New function to add IDs to landmark elements
function addLandmarkIds() {
  const landmarkElements = ['main', 'nav', 'header', 'footer', 'aside'];
  landmarkElements.forEach(tag => {
    const landmark = document.querySelector(tag);
    if (landmark && landmark.id === '') {
      landmark.id = `${tag}-${Math.floor(Math.random() * 1000)}`;
    }
  });
}

// New function to check landmark elements in the DOM
function checkLandmarkElementsInDom() {
  a11yStore.checkLandmarkElements();
}

// New function to add SVG accessibility props
function addSVGAccessibilityProps() {
  a11yStore.addSVGAccessibilityProps();
}

// New function to address accessibility issues from insight report
function addressAccessibilityIssues(report) {
  if (!report) return;
  a11yStore.addAnnouncement('Accessibility issues addressed');
}

// Preserve existing code functionality
function preserveExistingCode() {
  a11yStore.preserveExistingCode();
}

// Placeholder for new accessibility issue fixes based on insight report
function newFunction() {
  // Implement specific fixes based on insight report when available
}

// New functions to address accessibility issues mentioned in the insight report

function validateLandmarkAttributes() {
  if (typeof window === 'undefined') return;
  const landmarks = document.querySelectorAll('main, nav, header, footer, aside, [role="landmark"]');
  landmarks.forEach(el => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
      // Optionally add a default label, but leave as is for now
    }
  });
}

function setSvgAttributes(svg) {
  if (!svg) return;
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  if (!svg.getAttribute('aria-label') && !svg.getAttribute('aria-labelledby')) {
    const title = svg.getAttribute('title') || 'Image';
    svg.setAttribute('aria-label', title);
  }
}

function validateLinkAccessibility() {
  if (typeof window === 'undefined') return;
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.getAttribute('aria-label') && !link.getAttribute('aria-labelledby')) {
      const text = link.textContent.trim();
      if (!text) {
        // Could add aria-label based on context
      }
    }
  });
}

function handleFakeLinks() {
  if (typeof window === 'undefined') return;
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href.startsWith('javascript:')) {
      link.setAttribute('aria-label', 'Fake link');
      link.addEventListener('click', (e) => e.preventDefault());
    }
  });
}

// Export the new functions if they are needed to be used in other files (CommonJS)
module.exports = {
  addLangAttribute,
  addLandmarkRoles,
  ensureUniqueLandmarks,
  addAccessibleNamesToSVGs,
  fixFakeLinks,
  addScopeToTableHeaders,
  applyAccessibilityFixes,
  ensureElementHasId,
  addAriaLabel,
  renderDependencyGraph,
  myFunction,
  getLandmarkElements
};