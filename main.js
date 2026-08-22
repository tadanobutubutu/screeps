// main.js
export function rotateBack() {
  // ... some code to rotate back ...
}

// HTML output
function renderGraph() {
  return (
    <div>
      {/* ... other elements ... */}
      <a id="unrotate" href="#" onClick={rotateBack}>rotate back</a>
      {/* ... other elements ... */}
    </div>
  );
}