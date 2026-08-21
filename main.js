// Example of fixing the REACT_015 issue
// Assuming there is a <button> that uses the 'title' attribute instead of 'aria-label'

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

// Before:
// <button title="Click to submit">Submit</button>

// After:
// <button aria-label="Submit form">Submit</button>

// Example of fixing the REACT_027 issue
// Assuming there is a table that uses <th> tags without scope attributes

// Update to include the lang attribute in the HTML root element
export function addLangAttribute(element) {
  const htmlElement = document.documentElement;
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

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