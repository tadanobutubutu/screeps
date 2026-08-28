// Main.js

// Existing function (example)
function initializeApp() {
  console.log('App initialized');
}

// TODO: Implement getSvgAccessibleName() function here
function getSvgAccessibleName(svgElement) {
  if (!svgElement) {
    return null;
  }

  // Check aria-labelledby (highest priority)
  const ariaLabelledby = svgElement.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const labelElement = document.getElementById(ariaLabelledby);
    if (labelElement && labelElement.textContent) {
      const text = labelElement.textContent.trim();
      if (text) return text;
    }
  }

  // Check aria-label
  const ariaLabel = svgElement.getAttribute('aria-label');
  if (ariaLabel) {
    const text = ariaLabel.trim();
    if (text) return text;
  }

  // Check <title> element inside SVG
  const title = svgElement.querySelector('title');
  if (title && title.textContent) {
    const text = title.textContent.trim();
    if (text) return text;
  }

  // Check <desc> element inside SVG
  const desc = svgElement.querySelector('desc');
  if (desc && desc.textContent) {
    const text = desc.textContent.trim();
    if (text) return text;
  }

  return null;
}

module.exports = {
  initializeApp,
  getSvgAccessibleName
};