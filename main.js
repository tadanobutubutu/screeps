// Assuming you have a test file for the HTML content, such as `docsDependencyGraphTest.js`
describe('docs/dependency-graph.html', () => {
  it('should have all th elements with scope attribute', () => {
    // Load the HTML file content
    const htmlContent = fs.readFileSync(path.join(__dirname, 'docs', 'dependency-graph.html'), 'utf8');

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all <th> elements and check if they have the scope attribute
    const thElements = doc.querySelectorAll('th');
    thElements.forEach(th => {
      expect(th.getAttribute('scope')).toBeDefined();
    });
  });
});

// Function to add scope attributes to all th elements in the HTML
function addScopeAttributesToThElements(htmlContent) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');

  const thElements = doc.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });

  return new XMLSerializer().serializeToString(doc);
}

// Export the function for use in other files if needed
module.exports = {
  addScopeAttributesToThElements
};