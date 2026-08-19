// main.js

// Configuration metadata (from HEAD branch, adapted to JavaScript)
const metadata = {
  title: 'Screeps',
  description: 'Screeps is a programming game for programmers',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
        sizes: 'any',
      },
    ],
  },
};

// Existing code preserved here...

// New function or changes requested in the issue
function addAccessibleNameToSVG(svgElement) {
  // Check if the SVG element already has aria-hidden="true"
  if (svgElement.getAttribute('aria-hidden') !== 'true') {
    // Add aria-label or a title child if not already present
    if (!svgElement.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Descriptive title for SVG';
      svgElement.appendChild(title);
    }
    // Set aria-hidden="true" to hide the SVG from screen readers
    svgElement.setAttribute('aria-hidden', 'true');
  }
}

// Example usage of the function
// Assuming there is an SVG element with the ID 'favicon'
const faviconSVG = document.getElementById('favicon');
addAccessibleNameToSVG(faviconSVG);

// Continue with the rest of the main.js content...