// ... existing code ...

/**
 * Implementation of getSvgAccessibleName
 * @param {SVGSVGElement} svgElement 
 * @returns {string|null}
 */
function getSvgAccessibleName(svgElement) {
  if (!svgElement) return null;

  // 1. Check aria-label
  if (svgElement.getAttribute('aria-label')) {
    return svgElement.getAttribute('aria-label');
  }

  // 2. Check aria-labelledby
  const ariaLabelledBy = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledBy) {
    const labelElement = document.getElementById(ariaLabelledBy);
    if (labelElement) return labelElement.textContent;
  }

  // 3. Check <title> element inside SVG
  const titleElement = svgElement.querySelector('title');
  if (titleElement && titleElement.textContent) {
    return titleElement.textContent;
  }

  // TODO: This is the existing code that needs to be preserved
  // _Commit: 07177d2c69c06fd1dfe3543ad6d3c81baa3c821f_
  // <!-- todo-hash: 6c02eea5ebc55ce1d03924617c86b97c69d7d9d6 -->

  return null;
}

// <!--- START ADDITIONAL FUNCTION --->
/**
 * New function to be added as per the issue
 * @param {string} text 
 * @returns {string}
 */
function capitalizeFirstLetter(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// ... existing code and exports ...