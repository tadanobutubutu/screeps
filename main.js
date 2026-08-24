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

// [...] (You can add other functions to address table structure issues, landmark issues, unique landmarks, fake link issues etc.)

// Export the new functions
export { addAllSvgAccessibleNames };