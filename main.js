// Existing code preserved...

// New function to check link accessibility
function checkLinkAccessibility() {
  // Find all SVG elements in the document
  const svgs = document.querySelectorAll('svg');

  // Iterate over each SVG element
  svgs.forEach(svg => {
    // Check if the SVG has a <title> element
    const title = svg.querySelector('title');
    if (title) {
      // Check if the SVG has an 'aria-labelledby' attribute
      if (!svg.hasAttribute('aria-labelledby')) {
        // Set the 'aria-labelledby' attribute to the title's id
        svg.setAttribute('aria-labelledby', title.id);
      }
    } else {
      // Check if the SVG has an 'aria-label' attribute
      if (!svg.hasAttribute('aria-label')) {
        // Set the 'aria-label' attribute to the title's content
        svg.setAttribute('aria-label', title.textContent);
      }
    }
  });
}

// Call the function to check link accessibility
checkLinkAccessibility();

// Existing code preserved...