// Example of updating main.js to include aria-hidden for decorative SVGs
const updateFaviconSVG = (svgDataUrl) => {
  // Parse the SVG data URL to a DOM element
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgDataUrl, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Check if the SVG has a title element or aria-label attribute
  if (!svgElement.querySelector('title') && !svgElement.getAttribute('aria-label')) {
    // Add an aria-hidden attribute to hide the SVG from assistive technologies
    svgElement.setAttribute('aria-hidden', 'true');
  }

  // Convert the SVG element back to a data URL
  const serializer = new XMLSerializer();
  const updatedSvgDataUrl = 'data:image/svg+xml;base64,' + btoa(serializer.serializeToString(svgElement));

  return updatedSvgDataUrl;
};

// Assuming 'icons' object contains the SVG data URLs for favicons
const icons = {
  icon: updateFaviconSVG('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><title>Screeps Dashboard</title><text y="0.9em" font-size="90">🐛</text></svg>')
};

// ... rest of main.js