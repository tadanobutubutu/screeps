// TODO: This is the existing code that needs to be preserved

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

// Added: The requested function
function rotateBack() {
  // Function to rotate back - implementation placeholder
  console.log("Rotate back functionality executed");
}

// REACT_015: lang attribute should be added to the HTML element (typically in index.html)
function addLangAttribute(element, lang) {
  if (element) {
    element.setAttribute('lang', lang);
  }
}

// REACT_025: Add other accessibility changes as per the insight report
// [NEW] ADD YOUR CODE HERE if any other issues need to be addressed
function addressAccessibilityIssues() {
  // Replace <a id="unrotate" href="#">rotate back</a> with accessible button
  const rotateLink = document.getElementById('unrotate');
  
  if (rotateLink && rotateLink.tagName === 'A') {
    // Create a button element to replace the anchor tag
    const rotateButton = document.createElement('button');
    rotateButton.id = 'unrotate';
    rotateButton.setAttribute('role', 'button');
    rotateButton.setAttribute('aria-label', 'rotate back');
    rotateButton.textContent = rotateLink.textContent;
    
    // Copy any additional attributes if needed
    if (rotateLink.className) {
      rotateButton.className = rotateLink.className;
    }
    
    // Add click event listener
    rotateButton.addEventListener('click', function(event) {
      event.preventDefault();
      rotateBack();
    });
    
    // Add keyboard support (Enter and Space keys)
    rotateButton.addEventListener('keydown', function(event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        rotateBack();
      }
    });
    
    // Replace the anchor with the button
    rotateLink.parentNode.replaceChild(rotateButton, rotateLink);
  }
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
  
  addressAccessibilityIssues();
}

// Run accessibility improvements when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeAccessibility);
} else {
  initializeAccessibility();
}

// Ensure that all interactive elements have appropriate keyboard support
// Check that ARIA attributes are correctly paired and have appropriate values

// ADD THESE LINES TO ADD ACCESSIBILITY ATTRIBUTES TO ROOT ELEMENT
const rootElement = document.documentElement || document.body;

if (rootElement) {
  addLangAttribute(rootElement, 'en');
}

ensureUniqueLandmarks();

addMainLandmark(rootElement);

// Example usage for SVG accessibility:
// const svg1 = document.querySelector('.icon-svg-1');
// const svg2 = document.querySelector('.icon-svg-2');
// svg1 && addSvgAccessibleNames(svg1);
// svg2 && addSvgAccessibleNames(svg2);

// Run addressAccessibilityIssues as well
addressAccessibilityIssues();

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
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
    addressAccessibilityIssues
  };
}