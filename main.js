import React from 'react';

// Assuming children is a prop
function Layout({ children }) {
  return (
    <body>
      <main>{children}</main>
    </body>
  );
}

// New function to replace fake links with proper buttons
function RotateBackButton({ onClick }) {
  return (
    <button id="unrotate" onClick={onClick}>
      rotate back
    </button>
  );
}

export default Layout;
export { RotateBackButton };