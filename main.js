import React from 'react';

// Make role constants accessible at module level
export const role = 'button';
export const inputRole = 'checkbox';

const MyComponent = () => {
  // Existing component code

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
      </div>
    </div>
  );
};

// Export MyComponent
export default MyComponent;