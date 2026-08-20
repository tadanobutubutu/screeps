// tests/example.test.js

import { render } from '@testing-library/react';
import MyComponent from '../../path/to/MyComponent';
import AppLayout from '../../path/to/AppLayout';
import DashboardLayout from '../../path/to/DashboardLayout';

... () => {
  test('all <th> elements have the scope attribute', () => {
    const { getByText } = render(<MyComponent />);
    const allThElements = ...

    ... => {
      ...
    });
  });
});

// Add new tests for the main landmark requirement
describe('Accessibility', () => {
  test('app/layout.tsx has a main landmark', () => {
    const { container } = render(<AppLayout />);
    ...
  });

  ... has a main landmark', () => {
    const { container } = render(<DashboardLayout />);
    ...
  });

  ... has a main landmark', () => {
    // This would need to be tested differently since it's HTML
    // You might need to mock the document or use a different approach
    // For now, we'll just verify the structure is correct
    const doc = new ... 'text/html');
    ...
  });

  test('docs/index.html has a main landmark', () => {
    // Similar to above, would need proper testing approach
    const doc = new ... 'text/html');
    ...
  });
});

// RotateButton component - replaces the fake <a href="#"> link
// Before: <a id="unrotate" href="#">rotate back</a>
// After: <button id="unrotate" type="button">rotate back</button>
const RotateButton = ({ onClick }) => {
  return (
    <button id="unrotate" type="button" onClick={onClick}>
      rotate back
    </button>
  );
};

export { RotateButton };