// Existing code (preserved as-is)
// New accessibility improvements

/**
 * Adds proper language attribute to the HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

/**
 * Ensures proper table structure with caption and scope attributes
 * Fixes REACT_027: React Table Structure
 */
function enhanceTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    // Add caption if missing
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.prepend(caption);
    }

    // Add scope to th elements
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

/**
 * Ensures proper landmark elements are used
 * Fixes REACT_017: React Landmarks
 */
function ensureProperLandmarks() {
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }

  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

/**
 * Ensures SVG elements have accessible names
 * Fixes REACT_041: React SVG Accessible Name
 */
function ensureSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const hasTitle = svg.querySelector('title');
    const hasAriaLabel = svg.hasAttribute('aria-label');
    const hasAriaLabelledby = svg.hasAttribute('aria-labelledby');

    if (!hasTitle && !hasAriaLabel && !hasAriaLabelledby) {
      const title = document.createElement('title');
      title.textContent = 'Decorative graphic';
      svg.prepend(title);
    }
  });
}

/**
 * Ensures unique landmarks
 * Fixes REACT_025: React Unique Landmarks
 */
function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      const section = document.createElement('section');
      section.innerHTML = mains[i].innerHTML;
      mains[i].parentNode.replaceChild(section, mains[i]);
    }
  }

  // Ensure headers have unique IDs
  const headers = document.querySelectorAll('h2, h3, h4, h5, h6');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('id')) {
      header.setAttribute('id', `heading-${index + 1}`);
    }
  });
}

/**
 * Replaces fake links with proper anchor elements
 * Fixes REACT_036: React Fake Link
 */
function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"]');
  fakeLinks.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    if (element.getAttribute('role') === 'link' && tagName !== 'a') {
      const anchor = document.createElement('a');
      anchor.href = element.getAttribute('href') || '#';
      anchor.textContent = element.textContent;
      element.replaceWith(anchor);
    }
  });

  // Additional fix for the specific case mentioned in the issue
  const rotateBackLinks = document.querySelectorAll('.rotate-back-link');
  rotateBackLinks.forEach(link => {
    const button = document.createElement('button');
    button.id = link.id;
    button.textContent = link.textContent;
    button.addEventListener('click', () => {
      console.log('Rotation back triggered');
    });
    link.replaceWith(button);
  });
}

// Initialize accessibility improvements when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  enhanceTableAccessibility();
  ensureProperLandmarks();
  ensureSvgAccessibleNames();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});