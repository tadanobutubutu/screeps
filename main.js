// tests/htmlTableStructure.test.js
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

describe('HTML Table Structure', () => {
  it('should have scope attribute on all <th> elements', () => {
    const fileContent = readFileSync('path/to/your/html/file.html', 'utf8');
    const dom = new JSDOM(fileContent);
    const tables = dom.window.document.querySelectorAll('table');
    tables.forEach((table) => {
      const headers = table.querySelectorAll('th');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope');
      });
    });
  });
});

// Adding new test for SVG accessibility
describe('SVG Accessibility', () => {
  it('should have aria-hidden="true" for decorative SVGs', () => {
    // This would need to be adapted to your actual component structure
    // For example, if you're rendering a component that contains SVGs
    const { container } = render(<YourComponent />);
    const svgs = container.querySelectorAll('svg');
    svgs.forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });
});