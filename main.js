html
<!-- Toggle between 'col' and 'row' depending on whether the header corresponds to columns or rows. -->
const addScopes = (html) => {
  const thElements = html.getElementsByTagName('th');

  for (let i = 0; i < thElements.length; i++) {
    thElements[i].setAttribute('scope', 'col');
  }

  return html.toString();
};

// Read the file content
const fs = require('fs');
const htmlContent = fs.readFileSync('docs/dependency-graph.html', 'utf-8');

// Apply the fix
const fixedContent = addScopes(new DOMParser().parseFromString(htmlContent, 'text/html'));

// Save the file
fs.writeFileSync('docs/dependency-graph.html', fixedContent);