import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'polyfill-io/stable';
import 'some-other-polyfill';

// Function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.lang && navigator.language && navigator.language.length > 2) {
    htmlElement.lang = navigator.language.slice(0, 2);
  }
};

// New function to fix table structure issues
const fixTableStructure = (tables) => {
  if (!tables) {
    tables = document.querySelectorAll('table');
  }
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }

    // Check if table has proper headers
    const headers = table.querySelectorAll('th');
    const rows = table.querySelectorAll('tr');

    if (headers.length > 0 && rows.length > 0) {
      headers.forEach(header => {
        if (!header.getAttribute('scope')) {
          const parentRow = header.parentElement;
          if (parentRow.tagName === 'TR') {
            header.setAttribute('scope', 'col');
          } else {
            header.setAttribute('scope', 'row');
          }
        }
      });
    }
  });
};

// New function to add/fix landmark issues
const addMainLandmark = () => {
  let mainElement = document.querySelector('main, [role="main"]');

  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');

    const body = document.body;
    if (body && body.firstChild) {
      body.insertBefore(mainElement, body.firstChild);
    } else if (body) {
      body.appendChild(mainElement);
    }
  } else if (!mainElement.id) {
    mainElement.setAttribute('id', 'main');
  }
};

// New function to ensure unique landmarks
const ensureUniqueLandmarks = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  landmarks.forEach(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    const seen = new Set();

    elements.forEach(element => {
      let id = element.id;

      if (!id) {
        let generatedId;
        let counter = 0;

        do {
          generatedId = `${landmark}-${counter}`;
          counter++;
        } while (seen.has(generatedId));

        id = generatedId;
        element.setAttribute('id', id);
      }

      // Ensure uniqueness across all landmarks of the same type
      while (seen.has(id)) {
        let baseId = id;
        let suffix = 1;

        while (document.getElementById(`${baseId}-${suffix}`)) {
          suffix++;
        }

        id = `${baseId}-${suffix}`;
      }

      seen.add(id);
      element.setAttribute('id', id);
    });
  });
};

// New function to add accessible names to SVGs
const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');

  svgs.forEach((svg, index) => {
    const ariaLabel = svg.getAttribute('aria-label') ||
                      svg.getAttribute('title') ||
                      (svg.querySelector('title') ? svg.querySelector('title').textContent : null);

    if (!ariaLabel) {
      svg.setAttribute('aria-label', 'SVG Icon ' + (index + 1));
    }
  });
};

// New function to fix fake link issues
const fixFakeLinkIssue = () => {
  const links = document.querySelectorAll('a');

  links.forEach(link => {
    const href = link.getAttribute('href');

    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'link');
      link.setAttribute('href', '#');
    }
  });
};

// New function to validate the landmarks
const validateLandmark = () => {
  const landmarks = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region'];

  const missingLandmarks = landmarks.filter(landmark => {
    const elements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    return elements.length === 0;
  });

  if (missingLandmarks.length > 0) {
    throw new Error(`Missing landmarks: ${missingLandmarks.join(', ')}`);
  }
};

// New function to add custom validation
const addCustomValidation = () => {
  // Validate that main landmark exists
  const mainElement = document.querySelector('main, [role="main"]');
  if (!mainElement || !mainElement.id || mainElement.id !== 'main') {
    console.warn('Main landmark is missing or misnamed');
  }
};

// Helper functions (exported)
const getAccessibleName = (element) => {
  if (!element) return '';
  return element.getAttribute('aria-label') ||
         element.getAttribute('aria-labelledby') ||
         element.getAttribute('title') ||
         element.textContent || '';
};

const setAccessibleName = (element, name) => {
  if (!element) return;
  element.setAttribute('aria-label', name);
};

const wrapPrimaryContentInMain = () => {
  let mainElement = document.querySelector('main, [role="main"]');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');
    const body = document.body;
    if (body) {
      while (body.firstChild) {
        mainElement.appendChild(body.firstChild);
      }
      body.appendChild(mainElement);
    }
  }
  return mainElement;
};

// Initialize accessibility fixes on module load
const initializeAccessibilityFixes = () => {
  try {
    // Address REACT_015: Add lang attribute
    addLangAttribute();

    // Apply other accessibility fixes
    addMainLandmark();
    ensureUniqueLandmarks();
    addSvgAccessibleNames();
    fixFakeLinkIssue();

    // Validate landmarks
    validateLandmark();

    // Run custom validation
    addCustomValidation();
  } catch (error) {
    console.error('Error applying accessibility fixes:', error);
  }
};

// Execute accessibility fixes
initializeAccessibilityFixes();

// Fix table structure after tables are created (e.g., from React or dynamic loading)
document.addEventListener('DOMContentLoaded', () => {
  const tables = document.querySelectorAll('table');
  fixTableStructure(tables);
});

// Export all functions
module.exports = {
  getAccessibleName,
  setAccessibleName,
  wrapPrimaryContentInMain,
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateLandmark,
  addCustomValidation
};