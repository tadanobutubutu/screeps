function calculate(a, b) {
  return a + b;
}

function addAccessibleNameToSVG(svg) {
  const titleElement = document.createElement('title');
  titleElement.textContent = 'Accessible name for SVG';
  svg.insertBefore(titleElement, svg.firstChild);
  
  // Add role="img" for proper accessibility
  if (!svg.getAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  
  return svg;
}

// Existing code remains unchanged

// Example of existing exports that should be preserved
export { calculate, addAccessibleNameToSVG };

// Update to include the lang attribute in the HTML root element
export function addLangAttribute(element) {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

// Existing export preservation
export { calculate, addAccessibleNameToSVG, addLangAttribute };

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
export { calculate, addAccessibleNameToSVG, addLangAttribute, addScopeToTableHeaders };