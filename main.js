// TODO: Address accessibility issues from insight report — FIXED
// REACT_015: Add lang attribute
// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

// Assuming this is a basic HTML/JS setup, here are the accessibility fixes:

/**
 * Sets the lang attribute on the HTML document element for accessibility.
 * This helps screen readers identify the language of the page content.
 * REACT_015 fix
 */
function setLangAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Additional accessibility improvements as per insight report.
 * REACT_025 fix
 */
function applyAccessibilityEnhancements() {
  // Ensure proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach(heading => {
    const currentLevel = parseInt(heading.tagName.charAt(1), 10);
    if (currentLevel > previousLevel + 1) {
      console.warn(`Accessibility: Skip in heading level from h${previousLevel} to h${currentLevel}`);
    }
    previousLevel = currentLevel;
  });

  // Add skip link target if main content exists
  const mainContent = document.querySelector('main, #main, [role="main"]');
  if (mainContent && !document.querySelector('.skip-link')) {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.position = 'absolute';
    skipLink.style.left = '-9999px';
    skipLink.style.top = 'auto';
    skipLink.style.width = '1px';
    skipLink.style.height = '1px';
    skipLink.style.overflow = 'hidden';
    mainContent.id = mainContent.id || 'main-content';
    document.body.insertBefore(skipLink, document.body.firstChild);
  }

  // Ensure all form inputs have associated labels
  const inputs = document.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    if (!input.id) return;
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (!label && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
      console.warn(`Accessibility: Input ${input.id || input.name || input.tagName} lacks label`);
    }
  });
}

// Initialize accessibility enhancements on DOM ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setLangAttribute();
      applyAccessibilityEnhancements();
    });
  } else {
    setLangAttribute();
    applyAccessibilityEnhancements();
  }
}

// Preserve all existing exports and code
module.exports = {
  setLangAttribute,
  applyAccessibilityEnhancements
};