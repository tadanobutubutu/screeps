// main.js - Build/validation script for documentation
// This file preserves existing functionality while ensuring valid JavaScript syntax

// ... (other code)

/**
 * Validates that HTML documentation files have proper landmark elements
 * for accessibility compliance (REACT_017)
 */
function validateHtmlLandmarks() {
  const fs = require('fs');
  const path = require('path');
  
  const docsDir = path.join(__dirname, 'docs');
  const htmlFiles = ['index.html', 'dependency-graph.html'];
  const results = [];
  
  for (const file of htmlFiles) {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const hasMain = /<main[^>]*>/.test(content);
      const hasMainClose = /<\/main>/.test(content);
      
      results.push({
        file,
        hasMainLandmark: hasMain && hasMainClose,
        content: content.substring(0, 200) // Preview for debugging
      });
    }
  }
  
  return results;
}

/**
 * Ensures main landmark exists in HTML content
 * This would be used during build/generation process
 */
function ensureMainLandmark(htmlContent) {
  // Check if main already exists
  if (/<main[^>]*>/.test(htmlContent) && /<\/main>/.test(htmlContent)) {
    return htmlContent;
  }
  
  // Wrap primary content in main tag (simplified heuristic)
  // In practice, this would be more sophisticated based on actual HTML structure
  const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  if (bodyMatch) {
    const beforeBody = htmlContent.substring(0, bodyMatch.index + bodyMatch[0].indexOf('>') + 1);
    const bodyContent = bodyMatch[1];
    const afterBody = htmlContent.substring(bodyMatch.index + bodyMatch[0].lastIndexOf('</body>'));
    
    return beforeBody + '<main>' + bodyContent + '</main>' + afterBody;
  }
  
  return htmlContent;
}

function renderDependencyGraph() {
  // ... (existing code to render the dependency graph)

  // Replace the anchor with a button
  const rotateBackLink = document.getElementById('unrotate');
  if (rotateBackLink) {
    // Remove the anchor element
    rotateBackLink.parentNode.removeChild(rotateBackLink);

    // Create a new button element
    const rotateBackButton = document.createElement('button');
    rotateBackButton.id = 'unrotate';
    rotateBackButton.textContent = 'rotate back';
    rotateBackButton.onclick = function() {
      // Add the event handler for the button click if needed
      // For example, to scroll back to the top of the page:
      window.scrollTo(0, 0);
    };

    // Append the button to the parent element
    rotateBackButton.parentNode.appendChild(rotateBackButton);
  }
}

/**
 * Generates an accessible table header (thead) element with proper scope attributes
 * for screen reader compatibility (REACT_017)
 */
function generateTableHeader(headerContent) {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');

  headerContent.forEach((content) => {
    const th = document.createElement('th');
    th.textContent = content;
    th.setAttribute('scope', 'col'); // Add the scope attribute here
    tr.appendChild(th);
  });

  thead.appendChild(tr);
  return thead;
}

// ... (other code)

module.exports = {
  validateHtmlLandmarks,
  ensureMainLandmark,
  generateTableHeader,
  renderDependencyGraph
};

// CLI usage
if (require.main === module) {
  const results = validateHtmlLandmarks();
  console.log('Landmark validation results:');
  results.forEach(r => {
    console.log(`${r.file}: ${r.hasMainLandmark ? '✓ Has <main>' : '✗ Missing <main>'}`);
  });
  
  const missing = results.filter(r => !r.hasMainLandmark);
  if (missing.length > 0) {
    console.error('\nAccessibility issue: Missing <main> landmark in:', missing.map(m => m.file).join(', '));
    process.exit(1);
  }

  // Usage example:
  const headers = ['Header 1', 'Header 2', 'Header 3'];
  const tableHeader = generateTableHeader(headers);
  if (document.getElementById('myTable')) {
    document.getElementById('myTable').appendChild(tableHeader);
  }
}