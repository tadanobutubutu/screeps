import React, { useState, useRef } from 'react';
import { addLangAttribute } from './utils/addLangAttribute';

// Add Wrapper to provide the main content to be skipped by screen readers
function RootWrapper({ children }) {
  return <main id="rootWrapper" role="main">{children}</main>;
}

// Add Focusable button
function FocusableButton({ children, ...props }) {
  const btnRef = useRef(null);

  const focus = () => {
    if (btnRef.current) btnRef.current.focus();
  };

  return (
    <button {...props} ref={btnRef} aria-haspopup="true" onClick={focus}>
      {children}
    </button>
  );
}

// Your existing exports and functions

// Add Language Attribution
addLangAttribute({ root: document.documentElement });

export { RootWrapper, FocusableButton };

// The rest of your code...