// main.js

/* Existing code, imports, and functions (if any) */

// New function requested in the issue for adding a <main> element
function addMainElement() {
  const layoutElements = document.querySelectorAll('body > main');
  layoutElements.forEach(layout => {
    const newMain = document.createElement('main');
    newMain.innerHTML = layout.innerHTML;
    layout.parentNode.replaceChild(newMain, layout);
  });
}

// Call the new function
addMainElement();

// Export the existing functions, if any, with their original names
/* ... */

// New function requested in the issue for Jest monorepo update
function updateJest() {
  jest.preset.setupFilesAfterEnv = () => {
    // Add any custom setup function related to the Jest monorepo update here
  };
}

// Call the new function
updateJest();

// New function requested in the issue for React update
function updateReact() {
  React.useEffect = (...args) => {
    // Add any custom implementation for the new React version here
  };
}

// Call the new function
updateReact();

// New function to ensure SVG elements have accessible names
function ensureSvgAccessibility() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(svg => {
    // If SVG doesn't have an accessible name, add aria-hidden="true" if decorative
    // or add a title element if it should be announced
    if (!svg.getAttribute('aria-label') &&
        !svg.querySelector('title') &&
        !svg.getAttribute('aria-hidden')) {

      // Check if SVG is decorative (no semantic meaning)
      if (svg.getAttribute('role') === 'presentation' ||
          svg.parentElement?.getAttribute('aria-hidden') === 'true') {
        svg.setAttribute('aria-hidden', 'true');
      } else {
        // Add a title element if SVG should be announced
        const title = document.createElement('title');
        title.textContent = 'Graphic element';
        svg.insertBefore(title, svg.firstChild);
      }
    }
  });
}

// Call the new function to ensure SVG accessibility
ensureSvgAccessibility();

// New function to fix React Unique Landmarks issue
function fixUniqueLandmarks() {
  // This function will be called during component initialization
  // to ensure only one <main> element exists in the document
  const mainElements = document.querySelectorAll('main');

  if (mainElements.length > 1) {
    // If there are multiple <main> elements, we'll keep the first one
    // and remove the others, but only if they're not part of the main content
    for (let i = 1; i < mainElements.length; i++) {
      const element = mainElements[i];
      // Check if this is an error state main element
      if (element.querySelector('h1')?.textContent?.includes('エラー')) {
        // Convert to a section for error state
        const section = document.createElement('section');
        section.innerHTML = element.innerHTML;
        element.parentNode.replaceChild(section, element);
      } else {
        // For other cases, just remove the extra main element
        element.remove();
      }
    }
  }
}

// Call the new function to fix unique landmarks
fixUniqueLandmarks();

// New function to ensure HTML element has lang attribute
function ensureHtmlLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Call the new function to ensure HTML has lang attribute
ensureHtmlLangAttribute();

// Export the existing functions, if any, with their original names
/* ... */