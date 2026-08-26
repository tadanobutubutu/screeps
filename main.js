// Current main.js content
export function rotateBack() {
  // ... existing code ...
}

// New function to replace the anchor tag with a button
export function rotateBackButton() {
  return (
    <button id="unrotate" onClick={() => rotateBack()}>
      rotate back
    </button>
  );
}

// Existing test cases must be updated to use the new button component
// Example of a test case that might have been using the anchor tag:
describe('rotateBack', () => {
  it('should rotate back', () => {
    // ... existing test code ...
  });
});

// ... other test cases ...