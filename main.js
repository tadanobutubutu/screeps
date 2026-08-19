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

  it('should use button instead of hash-only href for in-page actions', () => {
    const htmlContent = fs.readFileSync(path.join(__dirname, 'docs', 'dependency-graph.html'), 'utf8');
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Check for the rotate back link
    const rotateBackLink = doc.querySelector('#unrotate');
    expect(rotateBackLink).toBeNull(); // The link should not exist anymore

    // Alternatively, if you're keeping the link but changing it to a button:
    // const rotateBackButton = doc.querySelector('#unrotate');
    // expect(rotateBackButton.tagName).toBe('BUTTON');
  });
});