import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';

/**
 * Handles the click on the "rotate back" control.
 * Using a button instead of an <a href="#"> provides proper
 * keyboard and screen‑reader semantics.
 */
function handleRotateBack(event) {
  event.preventDefault();

  // -----------------------------------------------------------------
  // Existing rotation logic goes here.
  // Keep the original implementation unchanged.
  // -----------------------------------------------------------------

  console.log('Rotate back action triggered');
}

/**
 * Main application component.
 */
function App() {
  return (
    <div>
      {/* Replace the hash‑only <a> with a <button> for accessibility */}
      <button type="button" id="unrotate" onClick={handleRotateBack}>
        rotate back
      </button>
      {/* ...rest of the existing UI... */}
    </div>
  );
}

/* Render the app */
ReactDOM.render(<App />, document.getElementById('root'));

export default App;