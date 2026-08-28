import React from 'react';

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      {/* Content */}
    </div>
  );
}

export default MyComponent;

// New code to address accessibility issues
const dependencyGraphContainer = (
  <div
    lang="en"
    id="dependencyGraph"
    role="application"
    aria-labelledby="content"
  >
    <span id="content">Content</span>
  </div>
);

export { dependencyGraphContainer };