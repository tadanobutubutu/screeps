// main.js - Accessibility improvements implementation

// Preserved existing code (if any) would be here.
// The following additions implement accessibility improvements.

/**
 * Improves accessibility by adding ARIA attributes, skip links,
 * and keyboard support.
 */
function improveAccessibility() {
  // Add skip to content link
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to content';
  skipLink.style.position = 'absolute';
  skipLink.style.left = '-9999px';
  skipLink.style.top = '0';
  skipLink.style.zIndex = '9999';
  skipLink.addEventListener('focus', () => {
    skipLink.style.left = '0';
  });
  skipLink.addEventListener('blur', () => {
    skipLink.style.left = '-9999px';
  });
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Ensure all sections have landmark roles
  document.querySelectorAll('section').forEach(section => {
    if (!section.hasAttribute('role')) {
      section.setAttribute('role', 'region');
    }
  });

  // Add aria-label to navigation if missing
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('aria-label')) {
    nav.setAttribute('aria-label', 'Main navigation');
  }

  // Add alt text to images that miss it
  document.querySelectorAll('img').forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });

  // Enhanced keyboard navigation for dropdowns and modals
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const button = dropdown.querySelector('.dropdown-toggle');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (button && menu) {
      button.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' && !menu.classList.contains('show')) {
          e.preventDefault();
          menu.classList.add('show');
          menu.querySelector('a, button')?.focus();
        }
      });
    }
  });
}

// Execute on DOM ready
document.addEventListener('DOMContentLoaded', improveAccessibility);

// Export the function for testing (if needed)
export { improveAccessibility };