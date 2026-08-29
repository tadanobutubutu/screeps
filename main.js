import _ from 'lodash';

// Existing exports and functions stay here

// New export for the myNewFunction
export function myNewFunction(arr) {
  return _.map(arr, item => item * 2);
}

// TODO: This is the existing code that needs to be preserved
// Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and createInPageButton())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), validateLandmarkStructure() and validateLandmarkAttributes())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and setSvgAttributes())
// - REACT_025: Ensure unique landmarks (2 issues) (handled by validateLandmarkUniqueness())
// - REACT_036: Fix 1 fake link issue (handled by createInPageButton(), validateLinkAccessibility() and handleFakeLinks())

// Import dependencyGraphContent
// TODO: This is the existing code that needs to be preserved
// Functions to ensure the element has an id, add aria-label, render dependency graphs
// (Previously existing code that needs to be preserved)
const dependencyGraphContent = require('./dependencyGraphContent');

// Function to ensure an element has an id
function ensureElementHasId(element) {
  if (!element.id) {
    element.id = `generated-id-${Math.random().toString(36).substr(2, 9)}`;
  }
  return element.id;
}

// Function to add aria-label to an element
function addAriaLabel(element, label) {
  if (element && label) {
    element.setAttribute('aria-label', label);
  }
}

/**
 * Sets accessibility properties on SVG elements.
 * @param {SVGElement} svgElement - The SVG element to modify
 */
function setSvgAccessibilityProps(svgElement) {
  if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
    return;
  }
  // Ensure the SVG has an id for accessibility
  ensureElementHasId(svgElement);
  // Add a default aria-label if none exists
  if (!svgElement.getAttribute('aria-label')) {
    addAriaLabel(svgElement, 'SVG graphic');
  }
}

/**
 * Checks if a link has appropriate accessibility attributes.
 * @param {HTMLElement} link - The link element to check
 * @returns {boolean} True if the link is accessible, false otherwise
 */
function isLinkAccessible(link) {
  // Check if link has proper href
  const href = link.getAttribute('href');
  if (!href || href === '#' || href === '') {
    return false;
  }

  // Check if link has text content or aria-label
  const hasText = link.textContent.trim().length > 0;
  const hasAriaLabel = link.getAttribute('aria-label');

  if (!hasText && !hasAriaLabel) {
    return false;
  }

  return true;
}

/**
 * Checks if a button has appropriate accessibility attributes.
 * @param {HTMLElement} button - The button element to check
 * @returns {boolean} True if the button is accessible, false otherwise
 */
function isButtonAccessible(button) {
  // Check if button has type attribute
  const type = button.getAttribute('type');

  // Check if button has text content or aria-label or aria-labelledby
  const hasText = button.textContent.trim().length > 0;
  const hasAriaLabel = button.getAttribute('aria-label');
  const hasAriaLabelledby = button.getAttribute('aria-labelledby');

  if (!hasText && !hasAriaLabel && !hasAriaLabelledby) {
    return false;
  }

  return true;
}

/**
 * Checks landmark element has appropriate accessibility attributes.
 * @param {string} role - The landmark role to check
 * @param {HTMLElement} element - The element to check
 */
function checkLandmarkElement(role, element) {
  // (code for checkLandmarkElement remains the same)
}

/**
 * Wraps the primary content of the page in a <main> element.
 * This improves accessibility by ensuring a proper main landmark exists.
 * @returns {HTMLElement|null} The main element created or existing, or null if body is not available
 */
function wrapPrimaryContentInMain() {
  if (typeof document === 'undefined' || !document.body) {
    return null;
  }

  // Check if a <main> element already exists
  let mainElement = document.querySelector('main');
  if (mainElement) {
    return mainElement;
  }

  // Identify landmark elements that should remain outside of <main>
  const elementsToExclude = [];
  const landmarks = document.querySelectorAll('header, nav, aside, footer, [role="banner"], [role="navigation"], [role="complementary"], [role="contentinfo"]');
  landmarks.forEach(landmark => elementsToExclude.push(landmark));

  // Create a new <main> element
  mainElement = document.createElement('main');

  // Move all body children that are not in the exclude list into <main>
  const bodyChildren = Array.from(document.body.children);
  bodyChildren.forEach(child => {
    if (!elementsToExclude.includes(child)) {
      mainElement.appendChild(child);
    }
  });

  // Append the <main> element to the body
  document.body.appendChild(mainElement);

  return mainElement;
}

/**
 * Checks landmark elements and sets appropriate aria-labels, also reporting any inaccessible elements.
 * @param {HTMLElement} [container=document] - The container to check for accessibility
 * @returns {Object} An object containing landmark accessibility check results
 */
function checkLandmarks(container = document) {
  // (code for checkLandmarks remains the same)
}

/**
 * Renders the index view of the application.
 */
function renderIndexView() {
  // Implement your code here.
  // Example of creating a button in-page:
  const button = document.createElement('button');
  button.textContent = 'Click Me';
  // Append the button to the body or another element as needed
  document.body.appendChild(button);
}

/**
 * Adds lang attribute to the HTML element if missing.
 * @returns {HTMLElement|null} The HTML element or null if document is not available
 */
function addLangAttribute() {
  if (typeof document !== 'undefined' && document.documentElement) {
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    return document.documentElement;
  }
  return null;
}

/**
 * Fixes table structure issues in the document or specific container.
 * @param {HTMLElement} [container=document] - The container to fix table issues in
 * @returns {NodeList} NodeList of fixed tables
 */
function fixTableStructureIssues(container = document) {
  // (code for fixTableStructureIssues remains the same)
}

/**
 * Adds or fixes main landmark element.
 * @returns {HTMLElement|null} The main element
 */
function addMainLandmark() {
  return wrapPrimaryContentInMain();
}

/**
 * Adds accessible names to all SVG elements in the document.
 * @returns {NodeList} NodeList of processed SVG elements
 */
function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => setSvgAccessibilityProps(svg));
  return svgs;
}

/**
 * Ensures landmark elements are unique in the document.
 * Keeps only a single <main> element and ensures other landmarks have unique labels.
 * @returns {Object} An object containing uniqueness information
 */
function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const mains = document.querySelectorAll('main, [role="main"]');
  const removedMains = [];
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      removedMains.push(mains[i]);
      mains[i].remove();
    }
  }

  // Ensure only one banner landmark
  const banners = document.querySelectorAll('[role="banner"], header');
  const removedBanners = [];
  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      removedBanners.push(banners[i]);
      banners[i].remove();
    }
  }

  // Ensure only one contentinfo/footer landmark
  const footers = document.querySelectorAll('[role="contentinfo"], footer');
  const removedFooters = [];
  if (footers.length > 1) {
    for (let i = 1; i < footers.length; i++) {
      removedFooters.push(footers[i]);
      footers[i].remove();
    }
  }

  // Ensure landmark labels are unique
  const landmarks = document.querySelectorAll(
    '[role="banner"], [role="complementary"], [role="contentinfo"], [role="form"], ' +
    '[role="main"], [role="navigation"], [role="search"], [role="region"], ' +
    '[role="article"], [role="aside"], [role="figure"], [role="footer"], ' +
    '[role="header"], [role="landmark"], main, header, footer, aside, nav, ' +
    'section[aria-label], form[aria-label]'
  );

  const labelSet = new Set();
  const updatedLabels = [];

  landmarks.forEach(landmark => {
    const label = landmark.getAttribute('aria-label');
    if (label) {
      if (labelSet.has(label)) {
        // Generate a unique label
        let newLabel = label;
        let counter = 1;
        while (labelSet.has(newLabel)) {
          newLabel = `${label} ${counter}`;
          counter++;
        }
        landmark.setAttribute('aria-label', newLabel);
        updatedLabels.push({ element: landmark, oldLabel: label, newLabel });
        labelSet.add(newLabel);
      } else {
        labelSet.add(label);
      }
    }
  });

  return {
    removedMains,
    removedBanners,
    removedFooters,
    updatedLabels,
    mainCount: mains.length,
    bannerCount: banners.length,
    footerCount: footers.length
  };
}

/**
 * Fixes fake link issues by converting links without href to buttons.
 * @returns {Array} Array of fixed link elements
 */
function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  const fixedLinks = [];

  links.forEach(link => {
    if (!isLinkAccessible(link)) {
      // Convert inaccessible links to buttons
      const button = document.createElement('button');
      button.textContent = link.textContent;
      const ariaLabel = link.getAttribute('aria-label');
      if (ariaLabel) {
        button.setAttribute('aria-label', ariaLabel);
      }
      link.parentNode.replaceChild(button, link);
      fixedLinks.push(button);
    }
  });

  return fixedLinks;
}

/**
 * Checks accessibility of links and buttons in a container.
 * @param {HTMLElement} [container=document] - The container to check
 * @returns {Object} An object containing accessibility check results
 */
function checkLinkAndButtonAccessibility(container = document) {
  const results = {
    isFullyAccessible: true,
    links: { accessible: [], inaccessible: [] },
    buttons: { accessible: [], inaccessible: [] }
  };

  // Check all links in the container
  const links = container.querySelectorAll ? container.querySelectorAll('a') : [];
  links.forEach(link => {
    if (isLinkAccessible(link)) {
      results.links.accessible.push(link);
    } else {
      results.links.inaccessible.push(link);
      results.isFullyAccessible = false;
    }
  });

  // Check all buttons in the container
  const buttons = container.querySelectorAll ? container.querySelectorAll('button') : [];
  buttons.forEach(button => {
    if (isButtonAccessible(button)) {
      results.buttons.accessible.push(button);
    } else {
      results.buttons.inaccessible.push(button);
      results.isFullyAccessible = false;
    }
  });

  return results;
}

// Function to render dependency graphs
function renderDependencyGraph(dependencies) {
  const graph = {};
  dependencies.forEach(dep => {
    graph[dep.name] = dep.dependencies || [];
  });
  return graph;
}

function getLandmarkData(id) {
  // ... implement your own logic to fetch landmark data here.
  return {
    id,
    name: "Not defined",
    structure: [],
    // ... other landmark data properties
  };
}

// Export all functions
module.exports = {
  ensureElementHasId,
  addAriaLabel,
  setSvgAccessibilityProps,
  isLinkAccessible,
  isButtonAccessible,
  checkLinkAndButtonAccessibility,
  renderDependencyGraph,
  getLandmarkData,
  functionA,
  functionB
};