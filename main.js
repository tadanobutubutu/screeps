// tests/example.test.js

import { render } from '@testing-library/react';
import MyComponent from '../../path/to/MyComponent';

describe('MyComponent', () => {
  test('all <th> elements have the scope attribute', () => {
    const { getByText } = render(<MyComponent />);
    const allThElements = getByText(/header/i).closest('table').querySelectorAll('th');

    allThElements.forEach((th) => {
      expect(th).toHaveAttribute('scope');
    });
  });

  // Add new tests for the main landmark requirement
  describe('Accessibility', () => {
    test('app/layout.tsx has a main landmark', () => {
      const { container } = render(<AppLayout />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    test('dashboard/app/layout.tsx has a main landmark', () => {
      const { container } = render(<DashboardLayout />);
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    test('docs/dependency-graph.html has a main landmark', () => {
      // This would need to be tested differently since it's HTML
      // You might need to mock the document or use a different approach
      // For now, we'll just verify the structure is correct
      const doc = new DOMParser().parseFromString(dependencyGraphHtml, 'text/html');
      expect(doc.querySelector('main')).toBeTruthy();
    });

    test('docs/index.html has a main landmark', () => {
      // Similar to above, would need proper testing approach
      const doc = new DOMParser().parseFromString(indexHtml, 'text/html');
      expect(doc.querySelector('main')).toBeTruthy();
    });
  });
});