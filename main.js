// Assuming main.js has a <html> tag, add the lang attribute based on your content
// For example, if the page is in English, set lang to 'en'
document.documentElement.setAttribute('lang', 'en');

// Function to add accessible names to SVGs
// You can refactor and improve it based on the SVG structure in your project
function addSvgAccessibleNames(svg) {
  const svgTitle = svg.querySelector('title');
  const svgDesc = svg.querySelector('desc');

  if (!svgTitle || !svgDesc) {
    console.error('Missing required SVG tags: title or desc');
    return;
  }

  svg.setAttribute('aria-labelledby', `${svgTitle.id} ${svgDesc.id}`);
}

// Function to find all SVG elements on the page and add accessible names
function addAllSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');

  svgs.forEach(addSvgAccessibleNames);
}

// Function to add scope attribute to th elements for accessibility
function addScopeToTableHeaders() {
  const tableHeaders = document.querySelectorAll('th');

  tableHeaders.forEach(th => {
    th.setAttribute('scope', 'col');
  });
}

// Function to find all th elements on the page and add the scope attribute
function addAllTableHeadersScope() {
  const thElements = document.querySelectorAll('th');

  thElements.forEach(th => {
    th.setAttribute('scope', 'col');
  });
}

// Function to address accessibility issues from insight report
// Implement logic based on insight report
function addressAccessibilityIssuesFromInsightReport() {
  // Example logic to highlight Low Contrast elements
  const lowContrastElements = document.querySelectorAll('.low-contrast');

  lowContrastElements.forEach(element => {
    element.style.outline = '2px solid red';
  });
}

// Export the new functions
export { addAllSvgAccessibleNames, addAllTableHeadersScope, addressAccessibilityIssuesFromInsightReport };