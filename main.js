// tests/example.test.js

import { render } from '@testing-library/react';
import MyComponent from '../../path/to/MyComponent';

describe('Accessibility Tests', () => {
  test('all <th> elements have the scope attribute', () => {
    const { getAllByRole } = render(<MyComponent />);
    const allThElements = getAllByRole('columnheader');

    allThElements.forEach((th) => {
      expect(th).toHaveAttribute('scope');
    });
  });

  test('component has a <main> landmark for accessibility', () => {
    const { container } = render(<MyComponent />);
    const mainElement = container.querySelector('main');
    
    expect(mainElement).not.toBeNull();
  });
});