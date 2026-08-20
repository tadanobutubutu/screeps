Here's the resolved file with both changes integrated:

```javascript
function addSvgAccessibility(svgElement) {
  if (!svgElement.hasAttribute('aria-hidden') && !svgElement.querySelector('title')) {
    const { compliant, issues } = validateSVGAccessibility(svgElement);
    if (!compliant) {
      // Use the new function to set aria properties
      const { ariaLabel } = getSVGAriaProps(false, 'Application icon');
      svgElement.setAttribute('role', 'img');
      svgElement.setAttribute(...Object.entries(ariaLabel));
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    addSvgAccessibility(svg);
  });
});

function ensureSingleMain() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].parentNode.removeChild(mainElements[i]);
    }
  }
}

document.addEventListener('DOMContentLoaded', ensureSingleMain);

// GetSVGAriaProps and validateSVGAccessibility functions are included below
// These functions are exported for better modularity and reusability

// Example usage in layout files:
// BEFORE (accessibility warning):
// <svg viewBox="0 0 32 32" width="32" height="32">
//   <path d="..." />
// </svg>
//
// AFTER (fixed - with accessible name):
// <svg viewBox="0 0 32 32" width="32" height="32" aria-label="Application icon">
//   <title>Application icon</title>
//   <path d="..." />
// </svg>

/**
 * Returns accessibility attributes for SVG elements
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSVGAriaProps(isDecorative = false, ariaLabel) {
  // Include the new function with a slight modification to return an object
  const props = getSVGAriaProps(isDecorative, ariaLabel);
  const ariaRole = props['aria-role'] || 'img';
  delete props['aria-role'];
  return { ...props, role: ariaRole };
}

/**
 * Validates SVG accessibility compliance
 * @param {Object} svgProps - Props from an SVG element
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateSVGAccessibility(svgProps) {
  // Include the new function with some modification to return relevant properties
  const issues = [];
  const hasAriaHidden = svgProps['aria-hidden'] === 'true';
  const hasAriaLabel = Boolean(svgProps['aria-label']);
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children &&
    (Array.isArray(svgProps.children)
      ? svgProps.children.some(c => c && c.type === 'title')
      : svgProps.children.type === 'title');

  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;

  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }

  return { compliant: isCompliant, issues };
}

export default {
  getSVGAriaProps,
  validateSVGAccessibility
};
```

This solution refactors the existing `getSVGAriaProps` function to return an object and introduces a new `validateSVGAccessibility` function for compliance check purposes. The new `addSvgAccessibility` function picks up these two functions and dynamically sets the aria properties based on the old function's rules or the new function's compliance check. This way, both changes are integrated into the codebase.