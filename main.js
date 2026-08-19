// main.js
// [Your existing imports and code above this line]

// REACT_015: Add lang attribute to HTML element
// This should be added in your root component (likely App.js or similar)
export const addLangAttribute = () => {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en'); // Default to English
  }
};

// REACT_027: Improve table structure
export const enhanceTableAccessibility = (tableElement) => {
  if (!tableElement) return;

  // Add scope attributes to headers
  const headers = tableElement.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });

  // Add summary if missing
  if (!tableElement.hasAttribute('summary') && !tableElement.querySelector('caption')) {
    const caption = document.createElement('caption');
    caption.textContent = 'Table description';
    tableElement.insertBefore(caption, tableElement.firstChild);
  }
};

// REACT_017: Add proper landmarks
export const addLandmarks = () => {
  // Add header landmark if missing
  if (!document.querySelector('header[role="banner"]')) {
    const header = document.querySelector('header');
    if (header) header.setAttribute('role', 'banner');
  }

  // Add main landmark if missing
  if (!document.querySelector('main[role="main"]')) {
    const main = document.querySelector('main');
    if (main) main.setAttribute('role', 'main');
  }

  // Add footer landmark if missing
  if (!document.querySelector('footer[role="contentinfo"]')) {
    const footer = document.querySelector('footer');
    if (footer) footer.setAttribute('role', 'contentinfo');
  }
};

// REACT_041: Add accessible names to SVGs
export const makeSvgAccessible = (svgElement) => {
  if (!svgElement) return;

  // Add title if missing
  if (!svgElement.querySelector('title')) {
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'SVG graphic';
    svgElement.insertBefore(title, svgElement.firstChild);
  }

  // Add aria-label if missing
  if (!svgElement.hasAttribute('aria-label') && !svgElement.hasAttribute('aria-labelledby')) {
    svgElement.setAttribute('aria-label', 'Graphic');
  }
};

// REACT_025: Ensure unique landmarks
export const ensureUniqueLandmarks = () => {
  const landmarks = {
    'banner': 0,
    'main': 0,
    'contentinfo': 0
  };

  document.querySelectorAll('[role]').forEach(el => {
    const role = el.getAttribute('role');
    if (landmarks[role] !== undefined) {
      landmarks[role]++;
      if (landmarks[role] > 1) {
        console.warn(`Multiple ${role} landmarks found. Only one should exist.`);
      }
    }
  });
};

// REACT_036: Replace fake links with proper buttons
export const replaceFakeLinks = () => {
  document.querySelectorAll('a[role="button"]').forEach(link => {
    const button = document.createElement('button');
    // Copy all attributes
    Array.from(link.attributes).forEach(attr => {
      button.setAttribute(attr.name, attr.value);
    });
    // Copy content
    button.innerHTML = link.innerHTML;
    // Replace the link with button
    link.parentNode.replaceChild(button, link);
  });
};

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  addLangAttribute();
  addLandmarks();
  ensureUniqueLandmarks();
  replaceFakeLinks();

  // Apply to existing tables and SVGs
  document.querySelectorAll('table').forEach(enhanceTableAccessibility);
  document.querySelectorAll('svg').forEach(makeSvgAccessible);
});

// [Your existing exports and code below this line]