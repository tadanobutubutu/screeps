// This function assumes that the <th> elements are wrapped in <div> tags
function addScopeToTableHeaders(htmlString) {
  // Regular expression to match <th> elements with <div> content
  const thWithDivRegex = /<th[^>]*><div[^>]*>(.*?)<\/div><\/th>/g;

  // Replace matched <th> elements with <th scope="col">...</th>
  const updatedHtmlString = htmlString.replace(thWithDivRegex, (match, p1) =>
    `<th scope="col">${p1}</th>`
  );

  return updatedHtmlString;
}

// Example usage:
const originalHtmlString = `
  <th><div>src/constants.js</div></th>
  <th><div>src/managers/roomManager.js</div></th>
  <!-- ... more <th> elements ... -->
`;

const updatedHtmlString = addScopeToTableHeaders(originalHtmlString);

console.log(updatedHtmlString);