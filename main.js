// TODO: Create or update the affected functions to be accessible
//------ BEGIN ORIGINAL CODE (unchanged)------

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
document.getElementById('someButton').addEventListener('click', rotateBack);

// main.js

function initializeAccessibility() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.getAttribute('hidden') !== null ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.hasAttribute('aria-label');
      const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title') !== null;
      const hasDesc = svg.querySelector('desc') !== null;

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('aria-hidden') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'presentation');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElement('title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureSvgAccessibleNames();
      updateAccessibleSvgNames();
    });
  } else {
    ensureSvgAccessibleNames();
    updateAccessibleSvgNames();
  }

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }
}

// Export functions for accessibility
module.exports = {
  rotateBack,
  initializeAccessibility,
  ensureSvgAccessibleNames: () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.getAttribute('hidden') !== null ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      const hasAriaLabel = svg.hasAttribute('aria-label');
      const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title') !== null;
      const hasDesc = svg.querySelector('desc') !== null;

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('aria-hidden') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('role', 'presentation');
      } else {
        const title = document.createElement('title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  },
  updateAccessibleSvgNames: (() => {
    let timeoutId = null;
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        if (typeof document !== 'undefined' && document.body) {
          const svgs = document.querySelectorAll('svg');
          svgs.forEach((svg) => {
            const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                             svg.getAttribute('hidden') !== null ||
                             svg.style.display === 'none' ||
                             svg.style.visibility === 'hidden';

            if (isHidden) {
              return;
            }

            const hasAriaLabel = svg.hasAttribute('aria-label');
            const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
            const hasTitle = svg.querySelector('title') !== null;
            const hasDesc = svg.querySelector('desc') !== null;

            if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
              return;
            }

            const isFavicon = svg.closest('link') !== null ||
                              (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                              svg.getAttribute('aria-hidden') === 'true';

            if (isFavicon) {
              svg.setAttribute('aria-hidden', 'true');
              svg.setAttribute('role', 'presentation');
            } else {
              const title = document.createElement('title');
              title.textContent = 'Icon';
              svg.insertBefore(title, svg.firstChild);
              svg.setAttribute('role', 'img');
              svg.setAttribute('aria-label', 'Icon');
            }
          });
        }
      }, 0);
    };
  })()
};

// Auto-initialize if in browser environment
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initializeAccessibility();
}