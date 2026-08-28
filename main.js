// TODO: Implement wrapPrimaryContentInMain function, including the added logic

/**
 * Wrap primary content in main div
 * @param { Document } doc - The document object to operate on
 */
function wrapPrimaryContentInMain(doc) {
  const primaryContent = doc.querySelector('main, [role="main"], article, [role="article"]');
  const main = doc.createElement('div');
  main.className = 'main';

  if (primaryContent.parentNode) {
    primaryContent.parentNode.replaceChild(main, primaryContent);
    main.appendChild(primaryContent);
  }
}

// ADD THE NEW FUNCTION HERE
function getSvgAccessibleName(doc) {
  const svgElements = doc.querySelectorAll('svg');
  const modifiedSvgs = [];

  svgElements.forEach((svg) => {
    const hasAriaLabel = svg.getAttribute('aria-label');
    const hasAriaLabelledby = svg.getAttribute('aria-labelledby');
    const titleElement = svg.querySelector('title');

    // Skip if already has accessible name
    if (hasAriaLabel || hasAriaLabelledby || titleElement) {
      return;
    }

    // Try to get a name from a nearby element (e.g., figcaption, preceding heading)
    const parent = svg.parentElement;
    let accessibleName = null;

    // Check for figcaption as sibling
    if (parent) {
      const figcaption = parent.querySelector('figcaption');
      if (figcaption) {
        accessibleName = figcaption.textContent.trim();
      }
    }

    // If no name found, check for id that could be used with aria-labelledby
    if (!accessibleName) {
      const id = svg.getAttribute('id');
      if (id) {
        const referencedElement = doc.querySelector(`[aria-labelledby="${id}"]`);
        if (referencedElement) {
          accessibleName = referencedElement.textContent.trim();
        }
      }
    }

    // Set accessible name via aria-labelledby pointing to a generated title
    const titleId = `svg-title-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const title = doc.createElement('title');
    title.id = titleId;
    title.textContent = accessibleName || 'SVG Image';
    
    // Insert title as first child of SVG
    if (svg.firstChild) {
      svg.insertBefore(title, svg.firstChild);
    } else {
      svg.appendChild(title);
    }
    
    svg.setAttribute('aria-labelledby', titleId);
    modifiedSvgs.push(svg);
  });

  return modifiedSvgs;
}

// ... (The rest of the existing functions and exports remain unchanged)

// ADD THE NEW FUNCTION TO THE EXPORTS
const { addMissingExportFunction } = require('./utils');

module.exports = {
  addProperLandmarkRegions,
  addMissingLandmarks,
  addAriaToFormControls,
  replaceMyButtonId,
  getLangAttribute,
  getFullLangAttribute,
  validateLandmark,
  validateLandmarkStructure,
  validateTableAccessibility,
  validateTableStructure,
  wrapPrimaryContentInMain,
  getSvgAccessibleName
};