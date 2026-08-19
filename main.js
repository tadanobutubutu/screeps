describe('Accessibility Tests', () => {
  it('should have all th elements with scope attribute', () => {
    // Load the HTML file content
    const htmlContent = require('fs').readFileSync(
      require('path').join(__dirname, 'docs', 'index.html'),
      'utf8'
    );

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Find all <th> elements and check if they have the scope attribute
    const thElements = doc.querySelectorAll('th');
    thElements.forEach(th => {
      expect(th.getAttribute('scope')).toBeTruthy();
    });
  });

  it('should have a main landmark for accessibility (REACT_017)', () => {
    // Load the HTML file content
    const htmlContent = require('fs').readFileSync(
      require('path').join(__dirname, 'docs', 'index.html'),
      'utf8'
    );

    // Use a DOM parser to parse the HTML content
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');

    // Check for main landmark
    const mainElement = doc.querySelector('main');
    expect(mainElement).not.toBeNull();
  });
});