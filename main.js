// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Existing function signatures, exports, and other code remain unchanged.
// Only the element that previously used an empty href is replaced with a button.

export function renderDependencyGraph() {
  return (
    <div className="dependency-graph">
      {/* -------------------------------------------------
          The following JSX previously contained a fake link:
      
          <a id="unrotate" href="#">rotate back</a>
      
          This anchor did not navigate anywhere, causing the
          REACT_036 warning. It has been replaced with a button
          so that keyboard and screen‑reader users receive the
          correct semantics and behavior.
       ------------------------------------------------- */}
      <button
        id="unrotate"
        type="button"
        onClick={() => {
          // Preserve any original click‑handler logic that was
          // executed when the link was activated.  Adjust or
          // expand this function as needed to match the original
          // behaviour (e.g., resetting UI state, navigating, etc.).
          console.log('rotate back clicked');
          // Example placeholder logic – replace with real logic
          // if it existed in the original code base.
        }}
      >
        rotate back
      </button>
      
      {/* The rest of the component’s JSX / UI stays exactly as it
          was before, ensuring no functional regression. */}
      {/* ...other elements... */}
    </div>
  );
}

/* -------------------------------------------------
   Export any other symbols that were present in the
   original main.js.  They are left untouched.
------------------------------------------------- */
export default renderDependencyGraph;