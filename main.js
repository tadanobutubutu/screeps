// main.js - Accessibility improvements added
// TODO: Address accessibility issues from insight report

// Example: Add alt text to an image

/**
 * Enhances accessibility for images by ensuring they have alt text
 * @param {string} selector - CSS selector for images
 * @param {string} defaultAlt - Default alt text if missing
 */
export function ensureImageAltText(selector = 'img', defaultAlt = 'Descriptive image') {
  const images = document.querySelectorAll(selector);
  images.forEach((img, index) => {
    if (!img.alt || img.alt.trim() === '') {
      img.alt = `${defaultAlt} ${index + 1}`;
      img.setAttribute('role', 'img');
    }
  });
}

/**
 * Adds ARIA labels to interactive elements missing labels
 * @param {string} selector - CSS selector for interactive elements
 */
export function ensureAccessibleLabels(selector = 'button, [role="button"]') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((el) => {
    if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby') && !el.textContent.trim()) {
      el.setAttribute('aria-label', 'Interactive button');
    }
  });
}

/**
 * Initializes accessibility enhancements
 */
export function initAccessibility() {
  ensureImageAltText();
  ensureAccessibleLabels();
  
  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > lastLevel + 1) {
      heading.setAttribute('aria-label', `Level ${level} heading: ${heading.textContent}`);
    }
    lastLevel = level;
  });
}

// Auto-initialize if DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAccessibility);
  } else {
    initAccessibility();
  }
}

// Export for testing
export default {
  ensureImageAltText,
  ensureAccessibleLabels,
  initAccessibility
};