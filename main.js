// tests/example.test.js

import { render } from '@testing-library/react';
import MyComponent from '../../path/to/MyComponent';

describe('Accessibility - React Table Structure', () => {
  test('all <th> elements have the scope attribute', () => {
    const { container } = render(<MyComponent />);
    const allThElements = container.querySelectorAll('th');

    allThElements.forEach((th) => {
      expect(th).toHaveAttribute('scope');
    });
  });
});