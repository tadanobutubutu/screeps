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

// Additional test to verify the scope attributes are correctly set
describe('HTML Table Scope Attributes', () => {
  it('should have correct scope values for table headers', () => {
    const fileContent = readFileSync('path/to/your/html/file.html', 'utf8');
    const dom = new JSDOM(fileContent);
    const tables = dom.window.document.querySelectorAll('table');

    tables.forEach((table) => {
      const headers = table.querySelectorAll('th');
      headers.forEach((header) => {
        const scopeValue = header.getAttribute('scope');
        expect(scopeValue).toMatch(/^(col|row)$/);
      });
    });
  });
});