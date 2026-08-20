/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSVGAriaProps(isDecorative = false, ariaLabel) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }
  if (ariaLabel) {
    return { 'aria-label': ariaLabel, role: 'img' };
  }
  return { role: 'img' };
}

function validateSVGAccessibility(svgProps) {
  const issues = [];
  const hasAriaHidden = svgProps['aria-hidden'] === 'true';
  const hasAriaLabel = Boolean(svgProps['aria-label']);
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children && (Array.isArray(svgProps.children) ? svgProps.children.some(c => c && c.type === 'title') : svgProps.children.type === 'title');
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  return { compliant: isCompliant, issues };
}

export default { getSVGAriaProps, validateSVGAccessibility };
```