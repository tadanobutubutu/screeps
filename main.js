// Assuming the main.js file is a JavaScript file that includes the HTML content of the ... file.

// ... (other code in main.js)

document.querySelectorAll("a").forEach(a => {
  const id = a.id;
  const button = document.createElement("button");
  button.id = id;
  button.role = "button";
  button.ariaLabel = a.innerHTML;
  button.onclick = function () {
    a.addEventListener("click", this.dispatchEvent.bind(this));
    a.dispatchEvent(new MouseEvent("click"));
  };
  button.innerHTML = a.innerHTML;
  a.parentNode.replaceChild(button, a);
});

function rotateBack() {
  // Your code to rotate back
}

// Added: The requested function
function createUnrotateButton() {
  const button = document.createElement('button');
  button.id = 'unrotate';
  button.setAttribute('role', 'button');
  button.ariaLabel = 'rotate back';
  button.textContent = 'rotate back';
  button.addEventListener('click', rotateBack);
  return button;
}

// REACT_041: Add accessible names to 2 SVGs
// Add aria-label or aria-labelledby to SVG elements
function addSvgAccessibility(svgElement, label) {
  if (svgElement) {
    svgElement.setAttribute('aria-label', label);
    svgElement.removeAttribute('aria-hidden');
  }
}

// Example usage for SVGs:
// const svg1 = document.querySelector('.icon-svg-1');
// const svg2 = document.querySelector('.icon-svg-2');
// addSvgAccessibility(svg1, 'Description of first icon');
// addSvgAccessibility(svg2, 'Description of second icon');

// REACT_027: Add scope="col" or scope="row" to <th> elements (already implemented)
// Ensure all <th> elements have scope attribute
function ensureThScope() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      // Determine if it's a column header or row header based on context
      const parent = th.parentElement;
      const parentTagName = parent ? parent.tagName.toLowerCase() : '';
      const isFirstCell = parent && Array.from(parent.children).indexOf(th) === 0;

      if (isFirstCell && parentTagName === 'tr') {
        th.setAttribute('scope', 'row');
      } else if (parentTagName === 'thead' || !isFirstCell) {
        th.setAttribute('scope', 'col');
      }
    }
  });
}

// Initialize accessibility improvements
function initializeAccessibility() {
  // Replace fake links with proper buttons
  const fakeLink = document.getElementById('unrotate');
  if (fakeLink && fakeLink.tagName === 'A') {
    const parent = fakeLink.parentElement;
    const newButton = createUnrotateButton();
    parent.replaceChild(newButton, fakeLink);
  }

  // Ensure table headers have proper scope
  ensureThScope();

  // Add accessible names to SVGs
  const svgs = document.querySelectorAll('svg:not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg, index) => {
    if (!svg.hasAttribute('aria-hidden') || svg.getAttribute('aria-hidden') !== 'true') {
      svg.setAttribute('aria-label', `Icon ${index + 1}`);
    }
  });
}

// Run accessibility initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute(rootElement, 'en');
}

ensureUniqueLandmarks();

module.exports = {
  rotateBack,
  createUnrotateButton,
  addSvgAccessibility,
  ensureThScope,
  initializeAccessibility,
  addMainLandmark,
  ensureUniqueLandmarks,
  addSvgAccessibleNames,
  fixFakeLinkIssue,
  addLangAttribute,
  fixTableStructure
};