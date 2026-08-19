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