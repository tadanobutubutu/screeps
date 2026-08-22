import { isArray } from 'lodash';

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @param {Object} [svgProps] - Optional SVG element props for title child detection
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function getSvgAccessibilityProps(isDecorative = false, ariaLabel, svgProps) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }

  const hasTitleChild =
    svgProps &&
    svgProps.children &&
    (isArray(svgProps.children)
      ? svgProps.children.some((c) => c && c.type === 'title')
      : svgProps.children.type === 'title');

  if (hasTitleChild || ariaLabel) {
    return {
      'aria-label': ariaLabel || 'SVG image',
      role: 'img',
    };
  }

  // Fallback: add role for better screen reader support
  return { role: 'img' };
}

/**
 * Validates SVG accessibility compliance
 * @param {Object} svgProps - Props from an SVG element
 * @returns {{compliant: boolean, issues: string[]}}
 */
export function validateSvgAccessibility(svgProps) {
  const issues = [];

  const hasAriaHidden = svgProps?.['aria-hidden'] === 'true';
  const hasAriaLabel = Boolean(svgProps?.['aria-label']);
  const hasRole = svgProps?.role === 'img';
  const hasTitleChild =
    svgProps?.children &&
    (isArray(svgProps.children)
      ? svgProps.children.some((c) => c && c.type === 'title')
      : svgProps.children.type === 'title');

  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;

  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }

  return { compliant: isCompliant, issues };
}

// Rest of the file remains unchanged