// Assuming main.js already contains the necessary import statements

// Update the first favicon SVG
const faviconSVG = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-hidden="true" // Add this attribute
  >
    <title>Screeps Dashboard</title>
    <text y=".9em" font-size="90">🐛</text>
  </svg>
`;

// Update the second favicon SVG
const secondFaviconSVG = `
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    aria-hidden="true" // Add this attribute
  >
    <text y=".9em" font-size="90">🐛</text>
  </svg>
`;

// Keep the rest of the content as it is

module.exports = {
  favicon: faviconSVG,
  secondFavicon: secondFaviconSVG,
  // Other exports if any...
};