import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'polyfill-io/stable';
import 'some-other-polyfill';

// Function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  if (!htmlElement.lang && navigator.language && navigator.language.length > 2) {
    htmlElement.lang = navigator.language.substring(0, 2);
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
  let mainElement = document.querySelector('main');

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
    const elements = document.querySelectorAll(`[role="${landmark}"]`);
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

        while (seen.has(`${baseId}-${suffix}`)) {
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
                      svg.getAttribute('aria-labelledby') ||
                      svg.getAttribute('title') ||
                      svg.getAttribute('desc') ? svg.getAttribute('desc') : null);

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
  const landmarks = document.querySelectorAll('[role]');
  
  landmarks.forEach(landmark => {
    const validRoles = ['main', 'navigation', 'search', 'contentinfo', 'complementary', 'form', 'region', 'banner', 'complementary'];
    const role = landmark.getAttribute('role');
    
    if (role && !validRoles.includes(role)) {
      console.warn(`Invalid landmark role: ${role}`);
    }
  });
};

// Export accessibility utilities
export {
  addLangAttribute,
  fixTableStructure,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  validateLandmark
};