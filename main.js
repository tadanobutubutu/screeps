function calculate(a, b) {
  return a + b;
}

function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.insertBefore(titleElement, svg.firstChild);
  
  const descElement = document.createElement('desc');
  descElement.textContent = 'Description of the SVG image';
  svg.insertBefore(descElement, svg.firstChild.nextSibling);
  
  return svg;
}

// Existing code remains unchanged

// Example of existing exports that should be preserved
export { calculate, addAccessibleNameToSVG };

// Update to include the lang attribute in the HTML root element
export function addLangToHTMLRoot(lang) {
  const htmlElement = document.querySelector('html');
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
}

// Existing export preservation
export { calculate, addAccessibleNameToSVG, addLangToHTMLRoot };

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
export { calculate, addAccessibleNameToSVG, addLangToHTMLRoot, addScopeToTableHeaders };