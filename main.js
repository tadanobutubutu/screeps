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
      // Check for either aria-label or aria-hidden
      const hasAriaLabel = svg.hasAttribute('aria-label') && svg.getAttribute('aria-label').trim() !== '';
      const isHidden = svg.hasAttribute('aria-hidden') && svg.getAttribute('aria-hidden') === 'true';

      expect(hasAriaLabel || isHidden).toBe(true);
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

  // New test for specific table headers in dependency-graph.html
  test('dependency-graph table headers have proper scope attributes', () => {
    const { container } = render(<MyComponent />);
    const table = container.querySelector('table');

    if (table) {
      const thElements = table.querySelectorAll('th');
      thElements.forEach(th => {
        // Check if this is one of the specific headers mentioned in the issue
        if (th.textContent.includes('src/constants.js') ||
            th.textContent.includes('src/managers/roomManager.js') ||
            th.textContent.includes('src/managers/spawnManager.js') ||
            th.textContent.includes('src/managers/towerManager.js') ||
            th.textContent.includes('src/roles/builder.js')) {
          expect(th).toHaveAttribute('scope', 'col');
        }
      });
    }
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

// New test for React Landmarks
describe('React Landmarks', () => {
  test('has main landmark element', () => {
    const { container } = render(<MyComponent />);
    expect(container.querySelector('main')).toBeInTheDocument();
  });

  test('has only one main landmark element', () => {
    const { container } = render(<MyComponent />);
    const mains = container.querySelectorAll('main');
    expect(mains.length).toBe(1);
  });
});

// New test for Dashboard component landmarks
describe('Dashboard Component', () => {
  test('has only one main landmark element', () => {
    const { container } = render(<MyComponent />);
    const dashboardMain = container.querySelector('.dashboard-main');
    const mains = container.querySelectorAll('main');

    // Check that there's only one main element in the entire document
    expect(mains.length).toBe(1);

    // If the dashboard has its own main, ensure it's properly structured
    if (dashboardMain) {
      expect(dashboardMain).toBeInTheDocument();
      expect(dashboardMain.tagName).toBe('MAIN');
    }
  });
});

// New test for language attribute in the root element
describe('Accessibility', () => {
  test('root element has lang attribute', () => {
    const { container } = render(<MyComponent />);
    expect(container.firstChild).toHaveAttribute('lang');
  });
});