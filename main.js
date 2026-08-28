import React from 'react';

function MyComponent() {
  // Old code that needs to be updated
  return (
    <div lang="en">
      {/* Content */}
      <span id="content">Content</span>
      {/* New code to be added */}
      <button onClick={() => alert('New button functionality!')}>Click Me!</button>
    </div>
  );
}

export default MyComponent;