// Add this to your main.js file
import React from 'react';
import { Button } from '@material-ui/core';

function MyCustomButton({ label, onClick, ...props }) {
  return (
    <Button
      aria-label={label}
      onClick={onClick}
      {...props}
    >
      {props.children}
    </Button>
  );
}

// Export the function
export default MyCustomButton;

// Add a comment explaining the change
// -- Start of added code --
// Addressing accessibility issues: adding 'aria-label' to custom button
// -- End of added code --