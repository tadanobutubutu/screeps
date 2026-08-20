function fixLanguageAttribute() {
  const nonInteractiveElements = document.querySelectorAll('div[role="presentation"]');
  nonInteractiveElements.forEach(element => {
    const button = document.createElement('button');
    button.setAttribute('role', 'button');
    button.setAttribute('tabindex', '-1');
    button.setAttribute('aria-disabled', 'false');
    button.textContent = element.textContent;
    element.parentNode.replaceChild(button, element);
  });
}
function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('th')) {
      const headerRow = document.createElement('tr');
      const header = document.createElement('th');
      header.setAttribute('scope', 'col');
      header.setAttribute('colspan', table.rows.length);
      header.textContent = 'Table Header';
      headerRow.appendChild(header);
      table.insertBefore(headerRow, table.firstChild);
    }
  });
}
function fixLandmarks() {
  const landmarkElements = document.querySelectorAll('main, nav, section, article, aside, footer');
  landmarkElements.forEach(element => {
    if (!element.hasAttribute('role')) {
      element.setAttribute('role', element.tagName.toLowerCase());
    } else if (element.tagName.toLowerCase() === 'main') {
      element.setAttribute('landmark', true);
    }
  });
}
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
dirname = '/@basemkf/';
let content = fs.readFile('main.js', 'utf8');
content = content.replace(/(\s*<!--\s*#pragma filter "parser: babel" \s*-->\s*)?export default {getSVGAriaProps, validateSVGAccessibility};/, `export { getSVGAriaProps, validateSVGAccessibility };`);
export default { getSVGAriaProps, validateSVGAccessibility };