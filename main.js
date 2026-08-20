// Example of how to update the main.js file to include the scope attribute
const originalMainJsContent = `
// Original main.js content here
`;

// This function will add the scope attribute to all th elements that lack it
function addScopeToThElements(htmlContent) {
  return htmlContent.replace(/<th\b[^>]*>/g, (match) => {
    // If the th element already has a scope attribute, return it unchanged
    if (match.includes('scope="')) {
      return match;
    }
    // Otherwise, add the scope attribute with a value of "col"
    return `<th scope="col">${match}</th>`;
  });
}

// Example usage:
const updatedMainJsContent = addScopeToThElements(originalMainJsContent);

// Output the complete updated main.js content inside a block