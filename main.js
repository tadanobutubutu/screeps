import React, { useState } from 'react';
import ReactDOM from 'react-dom';

function AlertMessage({ message }) {
  // ... existing code

  // Add role="alert" and aria-label for accessibility
  return (
    <div className="alert" role="alert" aria-label="Alert">
      {message}
    </div>
  );
}

// The rest of the code remains unchanged

export { AlertMessage };