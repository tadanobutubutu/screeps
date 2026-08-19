// Assuming you have a test file for the HTML content, such as ...
describe('HTML Accessibility Tests', () => {
  it('should have lang attribute on html element', () => {
    // Load the HTML file content
    const htmlContent = fs.readFileSync(path.join(__dirname, 'docs', 'index.html'), 'utf8');

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find the html element and check if it has lang attribute
    const htmlElement = doc.querySelector('html');
    expect(htmlElement).not.toBeNull();
    expect(htmlElement.getAttribute('lang')).toBeTruthy();
    expect(htmlElement.getAttribute('lang')).not.toBe('');
  });

  it('should have all th elements with scope attribute', () => {
    // Load the HTML file content
    const htmlContent = fs.readFileSync(path.join(__dirname, 'docs', 'index.html'), 'utf8');

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all <th> elements and check if they have the scope attribute
    const thElements = doc.querySelectorAll('th');
    thElements.forEach(th => {
      expect(th.getAttribute('scope')).toBeTruthy();
    });
  });
});