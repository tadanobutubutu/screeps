// Existing code in main.js
// ... (Preserve all existing code, exports, and functions)

const getAccessibleName = (node) => {
  const ariaLabel = node.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel;
  }
  const title = node.getAttribute('title');
  if (title) {
    return title;
  }
  return '';
};

const setAccessibleName = (node, accessibleName) => {
  node.setAttribute('aria-label', accessibleName);
};

const wrapPrimaryContentInMain = (content) => {
  const main = document.createElement('main');
  main.appendChild(content);
  return main;
};

// New function to add lang attribute to the HTML element
const addLangAttribute = () => {
  const htmlElement = document.documentElement;
  htmlElement.setAttribute('lang', 'en');
};

// New function to fix table structure issues
const fixTableStructure = () => {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.getAttribute('role')) {
      table.setAttribute('role', 'table');
    }
  });
};

// New function to add/fix landmark issues
const addMainLandmark = () => {
  let mainElement = document.querySelector('main');
  if (!mainElement) {
    mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');
    const body = document.querySelector('body');
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
    const existingElements = document.querySelectorAll(`[role="${landmark}"], ${landmark}`);
    let count = 0;
    existingElements.forEach(element => {
      if (!element.id) {
        element.setAttribute('id', `${landmark}-${count++}`);
      }
    });
  });
};

// New function to add accessible names to SVGs
const addSvgAccessibleNames = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      svg.setAttribute('aria-label', `SVG Icon ${index + 1}`);
    }
  });
};

// New function to fix fake link issues
const fixFakeLinkIssue = () => {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href === '#' || href === '') {
      link.setAttribute('role', 'presentation');
      link.style.display = 'none';
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

// Function to wrap specific content with main element
function wrapContentWithMain() {
  const contentToWrap = document.querySelectorAll('div.container, table#table-rotated');

  contentToWrap.forEach((content) => {
    const mainElement = document.createElement('main');
    mainElement.appendChild(content);
    content.parentNode.replaceChild(mainElement, content);
  });
}

// Call the function to wrap the content with <main>
wrapContentWithMain();

// ... (Preserve all existing code, exports, and functions)
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
  wrapContentWithMain
};