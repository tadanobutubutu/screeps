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

// Add tests for the SVG accessibility issue
describe('SVG Accessibility', () => {
  it('should have aria-label or title attribute on SVG elements', () => {
    // Load the HTML file content
    const htmlContent = fs.readFileSync(path.join(__dirname, 'docs', 'dependency-graph.html'), 'utf8');

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all <svg> elements
    const svgElements = doc.querySelectorAll('svg');
    svgElements.forEach(svg => {
      // Check for aria-label or title attribute
      expect(svg.getAttribute('aria-label') || svg.querySelector('title')).toBeDefined();
    });
  });
});