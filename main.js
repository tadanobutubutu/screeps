// ... (rest of the existing main.js code)

// Function to add aria-labelledby to SVGs with title elements
function addAriaLabelledbyToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (title) {
      const titleId = title.getAttribute('id');
      svg.setAttribute('aria-labelledby', titleId);
    }
  });
}

// Function to add aria-label to SVGs without title elements
function addAriaLabelToSVGs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (!title) {
      const svgText = svg.textContent || svg.innerText || 'Image';
      svg.setAttribute('aria-label', svgText);
    }
  });
}

// Call the functions to add aria-labels and aria-labelledby to SVGs
addAriaLabelledbyToSVGs();
addAriaLabelToSVGs();

// ... (rest of the existing main.js code)