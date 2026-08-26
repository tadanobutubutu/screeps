export function setDocumentLanguage(lang = 'en') {
  document.documentElement.lang = lang;
}

// Add a function to add aria-label to SVG elements for accessibility
export function addAriaLabelToSVG(svgString, label) {
  const svg = new DOMParser().parseFromString(svgString, "image/svg+xml");
  const titleElement = svg.getElementsByTagName('title')[0];
  if (titleElement) {
    titleElement.textContent = label;
  } else {
    const titleElement = document.createElement('title');
    titleElement.textContent = label;
    svg.querySelector('svg').appendChild(titleElement);
  }
}

// Example usage:
// addAriaLabelToSVG('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y="0.9em" font-size="90">🐛</text></svg>', 'Screeps Dashboard');