// main.js

// ... existing code (preserved) ...

// Function to ensure all SVG elements have accessible names
function ensureSvgAccessibleNames() {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }

  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg) => {
    // Check if SVG is hidden
    const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                     (svg.parentElement && svg.parentElement.getAttribute('aria-hidden') === 'true') ||
                     svg.style.display === 'none' ||
                     svg.style.visibility === 'hidden';

    if (isHidden) {
      return;
    }

    // Check for existing accessible name
    const hasAriaLabel = svg.getAttribute('aria-label') !== null;
    const hasAriaLabelledBy = svg.getAttribute('aria-labelledby') !== null;
    const hasTitle = svg.querySelector('title') !== null;
    const hasDesc = svg.querySelector('desc') !== null;

    if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
      return;
    }

    // Determine if decorative - SVGs used for favicons/decorative purposes
    const isFavicon = svg.closest('link') !== null ||
                      (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                      svg.getAttribute('data-favicon') === 'true';

    if (isFavicon) {
      svg.setAttribute('role', 'presentation');
      svg.setAttribute('aria-hidden', 'true');
    } else {
      // Add a generic title for non-decorative SVGs
      const title = document.createElement('title');
      title.textContent = 'Icon';
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', 'Icon');
    }
  });
}

// Function to handle updating accessible SVG names when DOM mutates
function updateAccessibleSvgNames() {
  setTimeout(() => {
    ensureSvgAccessibleNames();
  }, 0);
}

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      ensureSvgAccessibleNames();
    });
  } else {
    ensureSvgAccessibleNames();
  }

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false;
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && (node.tagName === 'SVG' || node.querySelector('svg'))) {
            shouldUpdate = true;
          }
        });
      });
      if (shouldUpdate) {
        updateAccessibleSvgNames();
      }
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }
  }
}

// ... existing code (preserved) ...

module.exports = {
  ensureSvgAccessibleNames,
  updateAccessibleSvgNames
};