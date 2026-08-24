import React from 'react';

function MySVGComponent() {
  // your SVG code here

  return (
    // Highlight the SVG element
    <svg data-testid="my-svg">
      // SVG elements
    </svg>
  );
}

// Now, provide an accessible name for the SVG component
export default {
  __docgenInfo: {
    description: 'Description of your component',
    methods: [{ name: 'MySVGComponent', parameters: [], returnType: Object }],
  },
  MySVGComponent: MySVGComponent,
};

// In your test file
test('MySVGComponent should have an accessible name', () => {
  const { getByTestId } = render(MySVGComponent);
  const svg = getByTestId('my-svg');

  // Check the accessible name using Jest
  expect(svg.getAttribute('aria-label')).toBe('Description of your component');
});