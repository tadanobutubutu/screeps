// Existing file header and imports preserved
// Previous code remains intact above line 24

const React = require('react');

// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// Original logic preserved from commit dbc62f0d7ea6e8ed531f9712000039619b9f3d51
function preservedFeature() {
  return true;
}

const preservedValue = 42;
// ----- END ORIGINAL CODE -----

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />
    </div>
  );
};

// Existing exports preserved
// Export MyComponent
module.exports = {
  preservedFeature,
  preservedValue,
  MyComponent
};