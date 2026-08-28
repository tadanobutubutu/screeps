import React from 'react';

// Add ARIA property role for better tab focusability
const role = 'button';
const inputRole = 'checkbox';

const MyComponent = () => {
  // Existing component code

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

// Export MyComponent
export default MyComponent;

// Export the role constants to make them accessible in main.js
export { role, inputRole };