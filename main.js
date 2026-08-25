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

// Function to add aria-label to elements that are missing accessible names
function addAriaLabelsToButtons() {
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
      button.setAttribute('aria-label', button.getAttribute('data-tooltip') || 'button');
    }
  });
}

// Function to ensure form inputs have associated labels
function ensureFormInputsHaveLabels() {
  const inputs = document.querySelectorAll('input, textarea, select');

  inputs.forEach(input => {
    const id = input.getAttribute('id');
    const hasLabel = id && document.querySelector(`label[for="${id}"]`) || input.closest('label');

    if (!hasLabel) {
      const labelText = input.getAttribute('placeholder') || 'Input field';
      const label = document.createElement('label');
      const uniqueId = id || `auto-label-${Math.random().toString(36).substr(2, 9)}`;

      label.setAttribute('for', uniqueId);
      label.textContent = labelText;
      input.setAttribute('id', uniqueId);
      input.parentNode.insertBefore(label, input);
    }
  });
}

// Function to add alt text to images that are missing it
function addAltTextToImages() {
  const images = document.querySelectorAll('img');

  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', img.getAttribute('data-alt') || '');
    }
  });
}

// Function to address accessibility issues from insight report
function addressAccessibilityIssuesFromInsightReport() {
  addAriaLabelsToButtons();
  ensureFormInputsHaveLabels();
  addAltTextToImages();
}

// Export the new functions
export { addAllSvgAccessibleNames, addAllTableHeadersScope, addressAccessibilityIssuesFromInsightReport };