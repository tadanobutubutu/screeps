// Example updated main.js (hypothetical structure based on typical table rendering in JS)
// Preserving all existing code and adding scope="col" to th elements

// Original code (assumed structure)
// ...
function renderDependencyGraphTable() {
  let html = '<table>';
  const headers = ['Header1', 'Header2', 'Header3']; // Example headers
  headers.forEach(header => {
    // Original without scope attribute
    html += `<tr><th>${header}</th></tr>`;
  });
  // ... rest of table rendering code
  html += '</table>';
  return html;
}
// ...

// Fixed version
function renderDependencyGraphTable() {
  let html = '<table>';
  const headers = ['Header1', 'Header2', 'Header3']; // Example headers
  headers.forEach(header => {
    // Added scope="col" to each th element
    html += `<tr><th scope="col">${header}</th></tr>`;
  });
  // ... rest of table rendering code remains unchanged
  html += '</table>';
  return html;
}
// ...

// Export/other functions remain unchanged as per requirements