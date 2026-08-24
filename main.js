// Original main.js content (with conflict markers removed)
export function rotateBack() {
  // Existing code related to rotateBack
}

// New function to replace the <a href="#"> with a <button>
export function rotateBackButton() {
  return (
    <button id="unrotate" onClick={() => rotateBack()}>
      rotate back
    </button>
  );
}

// Other existing functions and code
// ...