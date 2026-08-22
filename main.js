import { isArray } from 'lodash';
export function getSVGAriaProps(isDecorative = false, ariaLabel, svgProps) {
  if (isDecorative) {
    return { 'aria-hidden': 'true' };
  }
  const hasTitleChild = svgProps && svgProps.children && (isArray(svgProps.children) ? svgProps.children.some(c => c && c.type === 'title') : svgProps.children.type === 'title');
  if (hasTitleChild || ariaLabel) {
    return { 'aria-label': ariaLabel || svgProps?.props?.children, role: 'img' };
  }
  return { role: 'img' };
}
export function validateSVGAccessibility(svgProps) {
  const issues = [];
  const hasAriaHidden = svgProps['aria-hidden'] === 'true';
  const hasAriaLabel = svgProps['aria-label'];
  const hasRole = svgProps.role === 'img';
  const hasTitleChild = svgProps.children && (isArray(svgProps.children) ? svgProps.children.some(c => c && c.type === 'title') : svgProps.children.type === 'title');
  const isCompliant = hasAriaHidden || hasAriaLabel || hasTitleChild || hasRole;
  if (!isCompliant) {
    issues.push('SVG has no accessible name and is not hidden');
  }
  return { compliant: isCompliant, issues };
}
// Rest of the file remains unchanged