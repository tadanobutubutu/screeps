// Example of a function that could be added to main.js to update th elements
function updateTableHeadersWithScope(htmlContent) {
  // This regex will find all th elements that do not have a scope attribute
  const thWithoutScopeRegex = /<th\b[^>]*>(.*?)<\/th>/g;
  
  // Replace matches with updated th elements that include the scope attribute
  return htmlContent.replace(thWithoutScopeRegex, (match, content) => {
    // Check if the content inside the th is a div, which might indicate a rotated header
    if (content.trim().startsWith('<div>')) {
      // Replace the th with the scope attribute
      return `<th scope="col">${content}</th>`;
    }
    // If the th does not contain a div, just return the original match
    return match;
  });
}

// Example usage
const htmlContent = `
  <table>
    <thead>
      <tr>
        <th><div>src/constants.js</div></th>
        <th><div>src/managers/roomManager.js</div></th>
      </tr>
    </thead>
    <tbody>
      <!-- Table rows here -->
    </tbody>
  </table>
`;

const updatedHtmlContent = updateTableHeadersWithScope(htmlContent);
console.log(updatedHtmlContent);