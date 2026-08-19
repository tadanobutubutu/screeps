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
});