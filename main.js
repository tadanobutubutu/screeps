import React from 'react';

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      {/* Content */}
      <span id="content">Content</span>
    </div>
  );
}

// New function as per the issue request
function getLanguage() {
  return 'en';
}

export default MyComponent;
export { getLanguage };