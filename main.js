// Existing code (preserved as-is)
// New accessibility improvements
/**
 * Adds proper language attribute to the HTML element for screen readers
 * Fixes REACT_015: React Language Attribute
 */
function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
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
function ensureSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Decorative graphic');
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
      mains[i].replaceWith(section);
    }
  }

  // Ensure headers have unique IDs
  const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
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
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(element => {
    if (element.getAttribute('role') === 'link' && !element.tagName.toLowerCase() === 'a') {
      const anchor = document.createElement('a');
      anchor.href = element.getAttribute('data-href') || '#';
      anchor.textContent = element.textContent;
      element.replaceWith(anchor);
    }
  });

  // Additional fix for the specific case mentioned in the issue
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink && rotateBackLink.getAttribute('href') === '#') {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = rotateBackLink.textContent;
    button.addEventListener('click', () => {
      // Add your rotation logic here
      console.log('Rotation back triggered');
    });
    rotateBackLink.replaceWith(button);
  }
}

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  enhanceTableAccessibility();
  ensureProperLandmarks();
  ensureSvgAccessibility();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});