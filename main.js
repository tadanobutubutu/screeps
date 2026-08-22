import { isArray } from 'lodash';

/**
 * Returns accessibility attributes for SVG elements
 * Use this for decorative SVGs that don't need to be announced
 * @param {boolean} isDecorative - Whether the SVG is purely decorative
 * @param {string} [ariaLabel] - Optional accessible name
 * @param {Object} [svgProps] - Optional SVG element props for title child detection
 * @returns {Object} Accessibility props to spread onto <svg>
 */
export function ... = false, ariaLabel, svgProps) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }

  const hasTitleChild =
    svgProps &&
    svgProps.children &&
    ...
      ? ... => c && c.type === 'title')
      : ... === 'title');

  if (hasTitleChild || ariaLabel) {
    return {
      'aria-label': ariaLabel || ...
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
export function ... {
  const issues = [];

  const hasAriaHidden = ... === 'true';
  const hasAriaLabel = ...
  const hasRole = svgProps.role === 'img';
  const hasTitleChild =
    svgProps.children &&
    ...
      ? ... => c && c.type === 'title')
      : ... === 'title');

  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;

  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }

  return { compliant: isCompliant, issues };
}

// Rest of the file remains unchanged