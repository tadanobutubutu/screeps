// main.js

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
document.getElementById('unrotate').addEventListener('click', rotateBack);

// - REACT_017: Add/fix 4 landmark issues
const landmarks = document.querySelectorAll('.landmark');
landmarks.forEach((landmark, index) => {
  // Assuming you know which ARIA roles are correct for your landmarks
  landmark.setAttribute('role', 'landmark');
  landmark.setAttribute('aria-labelledby', `landmark-label-${index}`);
});

// main.js

function addProperLandmarkRegions() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  // - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
  const landmark1 = document.getElementById('landmark1');
  const landmark2 = document.getElementById('landmark2');
  if (landmark1) {
    landmark1.setAttribute('id', 'unique-landmark-1');
  }
  if (landmark2) {
    landmark2.setAttribute('id', 'unique-landmark-2');
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

  // Function to get the accessible name of an SVG element
  // Follows the WAI-ARIA Accessible Name Computation
  function getSvgAccessibleName(svg) {
    if (!svg || svg.tagName !== 'SVG') {
      return '';
    }

    // 1. Check for aria-label (highest priority)
    const ariaLabel = svg.getAttribute('aria-label');
    if (ariaLabel !== null && ariaLabel.trim() !== '') {
      return ariaLabel.trim();
    }

    // 2. Check for aria-labelledby
    const ariaLabelledBy = svg.getAttribute('aria-labelledby');
    if (ariaLabelledBy !== null && ariaLabelledBy.trim() !== '') {
      const ids = ariaLabelledBy.trim().split(/\s+/);
      const labels = ids
        .map(id => {
          const element = document.getElementById(id);
          return element ? element.textContent.trim() : '';
        })
        .filter(text => text !== '');
      if (labels.length > 0) {
        return labels.join(' ');
      }
    }

    // 3. Check for <title> child element
    const titleElement = svg.querySelector('title');
    if (titleElement && titleElement.textContent.trim() !== '') {
      return titleElement.textContent.trim();
    }

    // 4. Check for <desc> child element (used as fallback)
    const descElement = svg.querySelector('desc');
    if (descElement && descElement.textContent.trim() !== '') {
      return descElement.textContent.trim();
    }

    // 5. Check for associated <label> element (if SVG is in a label)
    const label = svg.closest('label');
    if (label) {
      const labelText = label.textContent.trim();
      if (labelText !== '') {
        return labelText;
      }
    }

    // 6. Check for parent element with aria-label or aria-labelledby
    const parent = svg.parentElement;
    if (parent) {
      const parentAriaLabel = parent.getAttribute('aria-label');
      if (parentAriaLabel !== null && parentAriaLabel.trim() !== '') {
        return parentAriaLabel.trim();
      }
      const parentAriaLabelledBy = parent.getAttribute('aria-labelledby');
      if (parentAriaLabelledBy !== null && parentAriaLabelledBy.trim() !== '') {
        const ids = parentAriaLabelledBy.trim().split(/\s+/);
        const labels = ids
          .map(id => {
            const element = document.getElementById(id);
            return element ? element.textContent.trim() : '';
          })
          .filter(text => text !== '');
        if (labels.length > 0) {
          return labels.join(' ');
        }
      }
    }

    // No accessible name found
    return '';
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

      // Check for existing accessible name using the new function
      const accessibleName = getSvgAccessibleName(svg);
      if (accessibleName !== '') {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('data-favicon') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
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

  ensureSvgAccessibleNames();

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

addProperLandmarkRegions();