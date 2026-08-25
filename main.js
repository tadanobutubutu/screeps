// Assuming there's an import from the HTML file
import htmlContent from './docs/dependency-graph.html';

// You might need to replace the existing content with the updated one
// For example, if you have a function that sets the document content:
function setDocumentContent(content) {
  document.open();
  document.write(content);
  document.close();
}

// Update the content with the lang attribute added
const updatedContent = htmlContent.replace('<html>', '<html lang="en">');

// Then set the updated content
setDocumentContent(updatedContent);