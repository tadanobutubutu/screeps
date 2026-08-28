/**
 * Get the accessible name for an SVG element
 * @param {SVGElement} svg - The SVG element to get the accessible name from
 * @returns {string} The computed accessible name
 */
function getSvgAccessibleName(svg) {
  if (!svg || !(svg instanceof Element)) {
    return '';
  }

  // Check aria-labelledby attribute
  const ariaLabelledby = svg.getAttribute('aria-labelledby');
  if (ariaLabelledby) {
    const names = ariaLabelledby.split(/\s+/).map(id => {
      const element = document.getElementById(id);
      return element ? element.textContent.trim() : '';
    }).filter(Boolean);
    if (names.length > 0) {
      return names.join(' ');
    }
  }

  // Check aria-label attribute
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) {
    return ariaLabel.trim();
  }

  // Check for <title> element within the SVG
  const title = svg.querySelector('title');
  if (title) {
    const titleText = title.textContent.trim();
    if (titleText) {
      return titleText;
    }
  }

  // Check for <desc> element within the SVG
  const desc = svg.querySelector('desc');
  if (desc) {
    const descText = desc.textContent.trim();
    if (descText) {
      return descText;
    }
  }

  return '';
}

// Preserve any existing exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getSvgAccessibleName };
}