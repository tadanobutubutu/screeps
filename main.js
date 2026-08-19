// Assuming you have a test file for the HTML content, such as ...
const fs = require('fs');
const path = require('path');

describe('HTML Accessibility Tests', () => {
  it('should have all th elements with scope attribute', () => {
    // Load the HTML file content
    const htmlContent = fs.readFileSync(path.join(__dirname, '..', 'docs'), 'utf8');

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