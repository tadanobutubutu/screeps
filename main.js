// tests/example.test.js

import { render } from ...
import MyComponent from '../../path/to/MyComponent';

... () => {
  test('all <th> elements have the scope attribute', () => {
    const { getByText } = render(<MyComponent />);
    const allThElements = ...

    ... => {
      ...
    });
  });
});