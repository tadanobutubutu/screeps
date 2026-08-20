// tests/htmlTableStructure.test.js
import { readFileSync } from 'fs';
import { JSDOM } from 'jsdom';

describe('HTML Table Structure', () => {
  it('should have scope attribute on all <th> elements', () => {
    const fileContent = readFileSync('path/to/your/html/file.html', 'utf8');
    const dom = new JSDOM(fileContent);
    const tables = dom.window.document.querySelectorAll('table');
    tables.forEach((table) => {
      const headers = table.query.querySelectorAll('th');
      headers.forEach((header) => {
        expect(header).toHaveAttribute('scope');
      });
    });
  });

  // New test for main landmark
  it('should have a main landmark in all HTML files', () => {
    const files = [
      'app/layout.tsx',
      'dashboard/app/layout.tsx',
      'docs/dependency-graph.html',
      'docs/index.html'
    ];

    files.forEach(file => {
      const fileContent = readFileSync(file, 'utf8');
      const dom = new JSDOM(fileContent);
      const mainElement = dom.window.document.querySelector('main');
      expect(mainElement).not.toBeNull();
    });
  });
});