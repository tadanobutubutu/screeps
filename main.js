// main.js
import React from 'react';

const RotateBackButton = ({ onClick }) => {
  return (
    <button
      id="unrotate"
      onClick={onClick}
      aria-label="Rotate back"
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        font: 'inherit',
        color: 'inherit',
        cursor: 'pointer',
        textDecoration: 'underline'
      }}
    >
      rotate back
    </button>
  );
};

export default RotateBackButton;