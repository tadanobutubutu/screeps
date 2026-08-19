// Current main.js content with conflict markers
// <<<<<<< HEAD
// import React from 'react';

// const DependencyGraph = () => {
//   return (
//     // ... other JSX ...
//     <a id="unrotate" href="#">rotate back</a>
//     // ... other JSX ...
//   );
// };

// export default DependencyGraph;
// >>>>>>> origin/main

// Updated main.js content
import React from 'react';

const DependencyGraph = () => {
  return (
    // ... other JSX ...
    <button id="unrotate" onClick={() => {/* Your action here */}}>rotate back</button>
    // ... other JSX ...
  );
};

export default DependencyGraph;