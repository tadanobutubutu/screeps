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

// Assuming the issue is related to the HTML file mentioned in the issue report,
// here's the change to be applied to the HTML file (docs/dependency-graph.html):

// Add this at the top of the file, before the opening <body> tag:
/*
<html lang="en">
*/