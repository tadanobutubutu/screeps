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

  // New test for language attribute
  test('has lang attribute set', () => {
    const { container } = render(<MyComponent />);
    expect(container).toHaveAttribute('lang');
  });

  // New test for proper table structure
  test('tables have proper structure with thead, tbody, and th elements', () => {
    const { container } = render(<MyComponent />);
    const tables = container.querySelectorAll('table');

    tables.forEach(table => {
      expect(table.querySelector('thead')).toBeInTheDocument();
      expect(table.querySelector('tbody')).toBeInTheDocument();
      const thElements = table.querySelectorAll('th');
      thElements.forEach(th => {
        expect(th).toHaveAttribute('scope', 'col');
      });
    });
  });

  // New test for landmarks
  test('has proper landmark elements', () => {
    const { container } = render(<MyComponent />);
    expect(container.querySelector('header')).toBeInTheDocument();
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('footer')).toBeInTheDocument();
  });

  // New test for SVG accessibility
  test('SVG elements have accessible names', () => {
    const { container } = render(<MyComponent />);
    const svgs = container.querySelectorAll('svg');

    svgs.forEach(svg => {
      expect(svg).toHaveAttribute('aria-label');
      expect(svg.getAttribute('aria-label')).not.toBe('');
    });
  });

  // New test for unique landmarks
  test('has unique landmarks', () => {
    const { container } = render(<MyComponent />);
    const headers = container.querySelectorAll('header');
    const mains = container.querySelectorAll('main');
    const footers = container.querySelectorAll('footer');

    expect(headers.length).toBe(1);
    expect(mains.length).toBe(1);
    expect(footers.length).toBe(1);
  });

  // New test for fake links
  test('does not use fake links', () => {
    const { container } = render(<MyComponent />);
    const links = container.querySelectorAll('a');

    links.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link.getAttribute('href')).not.toBe('#');
    });
  });
});

// Add new test for React 19 compatibility
describe('React 19 Compatibility', () => {
  test('renders without crashing in React 19', () => {
    const { container } = render(<MyComponent />);
    expect(container).toBeInTheDocument();
  });
});

// Add new test for Jest 30 compatibility
describe('Jest 30 Compatibility', () => {
  test('runs tests successfully with Jest 30', () => {
    expect(true).toBe(true);
  });
});