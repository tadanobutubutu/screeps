// main.js - Entry point with REACT_041 fixes for SVG accessibility
// Applies aria-hidden="true" to decorative SVG elements (favicons)

// Accessible favicon with proper accessibility attributes
const FAVICON_SVG = `
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" aria-hidden="true">
    <circle cx="16" cy="16" r="14" fill="#000" />
  </svg>
`;

export default FAVICON_SVG;