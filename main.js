import React from 'react';

function MyComponent() {
  // Updated code with accessibility improvements
  return (
    <div lang="en" aria-labelledby="content">
      {/* Content */}
      <span id="content" aria-hidden="true">Content</span>
    </div>
  );
}

export default MyComponent;