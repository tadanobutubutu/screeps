function calculate(a, b) {
  return a + b;
}

function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.appendChild(titleElement);
  return svg;
}

// Existing code remains unchanged

// Example of existing exports that should be preserved
export { calculate, addAccessibleNameToSVG };

// Update to include the lang attribute in the HTML root element
export function updateRootElementWithLangAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Existing export preservation
export { calculate, addAccessibleNameToSVG, updateRootElementWithLangAttribute };

// Add scope attribute to th elements as per the issue
export function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');
  tableHeaders.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// Existing export preservation
export { calculate, addAccessibleNameToSVG, updateRootElementWithLangAttribute, addScopeToTableHeaders };

// New function to add accessible name to SVGs used in the application
export function addAccessibleNameToAllSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('use[title]')) {
      addAccessibleNameToSVG(svg);
    }
  });
}