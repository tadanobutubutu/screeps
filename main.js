// Assuming the original main.js looked something like this:
// <div lang="en" className="content">
//     <p>Some content here...</p>
// </div>

// The updated main.js would be:
import React from 'react';

function MainContent() {
  return (
    <div className="content" lang="en">
      <p>Some content here...</p>
    </div>
  );
}

export default MainContent;