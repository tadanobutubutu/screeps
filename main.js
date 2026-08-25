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

// Implement function for addressing accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport() {
  // Apply accessibility fixes to SVGs
  addAllSvgAccessibleNames();
  
  // Apply accessibility fixes to table headers
  addAllTableHeadersScope();
  
  // Fix images missing alt attributes
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });
  
  // Ensure form inputs have associated labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]):not([type="image"])');
  inputs.forEach(input => {
    const id = input.id;
    if (id) {
      const label = document.querySelector(`label[for="${id}"]`);
      if (!label && !input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
        console.warn(`Input with id="${id}" is missing an associated label`);
      }
    }
  });
  
  // Check for proper heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)));
  
  for (let i = 1; i < headingLevels.length; i++) {
    if (headingLevels[i] - headingLevels[i - 1] > 1) {
      console.warn(`Heading hierarchy issue: skipping from h${headingLevels[i - 1]} to h${headingLevels[i]}`);
    }
  }
  
  console.log('Addressing accessibility issues from insight report');
}

// Export the new functions
export { addAllSvgAccessibleNames, addAllTableHeadersScope, addressAccessibilityIssuesFromInsightReport };