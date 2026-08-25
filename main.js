// Add this at the top of your main.js file or in a separate utility file to be imported where needed

function addAccessibleNameToSvg(svgString) {
  // Replace the SVG string with one that includes an `aria-label`
  return svgString.replace(/<svg[^>]*>/g, (svg) => {
    // We are adding a default aria-label, but you can replace it with a more descriptive one if needed
    return `${svg} aria-label="Icon Description"`;
  });
}

// Example usage:
// const updatedSvgString = addAccessibleNameToSvg(yourSvgStringHere);
// Replace yourSvgStringHere with the actual SVG string you're using

// ... rest of your main.js code ...

// When you're ready to use the updated SVG strings, replace the existing ones in your codebase
// with the ones returned by the addAccessibleNameToSvg function.