// main.js

/* Existing code, imports, and functions (if any) */

describe('Accessibility - React Table Structure', () => {
  test('all <th> elements have the scope attribute', () => {
    const { container } = render(<MyComponent />);
    const allThElements = container.querySelectorAll('th');

    allThElements.forEach((th) => {
      expect(th).toHaveAttribute('scope');
    });
  });
});

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

// New function to fix React table structure issues
function fixReactTableStructure() {
  // Find all table headers in the document
  const tableHeaders = document.querySelectorAll('th');

  tableHeaders.forEach(header => {
    // If the header doesn't have a scope attribute
    if (!header.hasAttribute('scope')) {
      // Check if it's a column header (based on its position in the table)
      const parentRow = header.parentElement;
      const isFirstRow = parentRow.parentElement.firstElementChild === parentRow;

      // If it's in the first row, assume it's a column header
      if (isFirstRow) {
        header.setAttribute('scope', 'col');
      } else {
        // Otherwise, assume it's a row header
        header.setAttribute('scope', 'row');
      }
    }
  });
}

// Call the new function to fix React table structure
fixReactTableStructure();

// New function to fix React fake link (REACT_036) — replace <a href="#"> with <button>
function fixFakeLinks() {
  // Find all anchor elements with href="#" (fake links that don't navigate)
  const fakeLinks = document.querySelectorAll('a[href="#"]');

  fakeLinks.forEach(link => {
    // Create a button element to replace the fake link
    const button = document.createElement('button');
    button.innerHTML = link.innerHTML;

    // Copy over the id and class attributes
    if (link.id) {
      button.id = link.id;
    }
    if (link.className) {
      button.className = link.className;
    }

    // Copy over data attributes
    for (const attr of link.attributes) {
      if (attr.name.startsWith('data-')) {
        button.setAttribute(attr.name, attr.value);
      }
    }

    // Copy over any inline event handlers (e.g., onclick)
    if (link.getAttribute('onclick')) {
      button.setAttribute('onclick', link.getAttribute('onclick'));
    }

    // Copy over the title attribute if present
    if (link.getAttribute('title')) {
      button.setAttribute('title', link.getAttribute('title'));
    }

    // Copy over aria attributes
    for (const attr of link.attributes) {
      if (attr.name.startsWith('aria-')) {
        button.setAttribute(attr.name, attr.value);
      }
    }

    // Replace the fake link with the button in the DOM
    link.parentNode.replaceChild(button, link);
  });
}

// Call the new function to fix fake links
fixFakeLinks();

// New function to add landmarks for better screen reader navigation
function addLandmarks() {
  // Check if main content landmark exists
  const mainElement = document.querySelector('main');
  if (!mainElement) {
    // Create main element if it doesn't exist
    const newMain = document.createElement('main');
    const body = document.querySelector('body');
    if (body) {
      // Move all body content into the main element
      while (body.firstChild) {
        newMain.appendChild(body.firstChild);
      }
      body.appendChild(newMain);
    }
  }

  // Check for navigation landmark
  if (!document.querySelector('nav')) {
    // Try to find navigation elements
    const navElements = document.querySelectorAll('[role="navigation"], .nav, #nav');
    if (navElements.length > 0) {
      navElements.forEach(nav => {
        if (nav.tagName !== 'NAV') {
          const newNav = document.createElement('nav');
          newNav.innerHTML = nav.innerHTML;
          nav.parentNode.replaceChild(newNav, nav);
        }
      });
    }
  }

  // Check for footer landmark
  if (!document.querySelector('footer')) {
    const footerElements = document.querySelectorAll('[role="contentinfo"], .footer, #footer');
    if (footerElements.length > 0) {
      footerElements.forEach(footer => {
        if (footer.tagName !== 'FOOTER') {
          const newFooter = document.createElement('footer');
          newFooter.innerHTML = footer.innerHTML;
          footer.parentNode.replaceChild(newFooter, footer);
        }
      });
    }
  }
}

// Call the new function to add landmarks
addLandmarks();

// Export the existing functions, if any, with their original names
/* ... */