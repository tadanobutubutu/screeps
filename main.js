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

// Function to implement addressing accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport() {
  // The implementation will depend on the insight report details
  // As an example, let's assume the report suggests adding labels to inputs
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    const label = document.createElement('label');
    label.htmlFor = input.id;
    label.textContent = 'Input description';
    input.parentNode.insertBefore(label, input);
  });
}

// Export the new functions
export { addAllSvgAccessibleNames, addAllTableHeadersScope, addressAccessibilityIssuesFromInsightReport };