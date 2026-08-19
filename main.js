// Example of how to update th elements in a hypothetical main.js file

// Import the HTML content if it's in a separate file or component
import dependencyGraphHtml from './docs/dependency-graph.html';

// Function to update th elements with scope attribute
function updateThScope(htmlContent) {
  return htmlContent
    .replace(/<th.*?>(.*?)<\/th>/g, (match, p1) => {
      // Add scope="col" to the opening th tag
      return `<th scope="col">${p1}</th>`;
    });
}

// Update the HTML content with the new scope attributes
const updatedHtmlContent = updateThScope(dependencyGraphHtml);

// Output the updated HTML content to the console or save it to a file
console.log(updatedHtmlContent);

// If you need to write the updated content to a file, you could use Node.js fs module:
// fs.writeFileSync('./docs/dependency-graph.html', updatedHtmlContent);