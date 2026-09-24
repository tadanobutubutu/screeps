function getAccessibleNameFromSVG(svgContent) {
  const parser = new DOMParser();
  const svgDOM = parser.parseFromString(svgContent, "image/svg+xml");
  const titleElement = svgDOM.querySelector("title");

  return titleElement ? titleElement.textContent : svgDOM.querySelector("desc").textContent;
}

// Usage:
const svgContent = '<svg><title>My SVG Title</title><desc>My SVG Description</desc></svg>';
console.log(getAccessibleNameFromSVG(svgContent));  // Outputs: My SVG Title