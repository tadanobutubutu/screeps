import React from 'react';

const MyComponent = () => {
  // Existing component code

  // Add ARIA property role for better tab focusability
  const role = 'button';
  const inputRole = 'checkbox';

  // New changes or functions
  const newFunction = () => {
    console.log('This is a new function added to main.js');
  };

  return (
    <div>
      {/* Existing component JSX */}

      {/* Add role attribute for better tab focusability */}
      <button role={role}>Button with ARIA role</button>

      {/* Add role='checkbox' attribute for checkboxes */}
      <input type="checkbox" role={inputRole} />

      {/* New changes or functions */}
      <div>
        {/* Example of a new function or change */}
        <p>Example of new functionality or change</p>
        <button onClick={newFunction}>Run New Function</button>
      </div>
    </div>
  );
};

// Export MyComponent
export default MyComponent;