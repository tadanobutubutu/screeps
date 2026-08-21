// Current main.js content with conflict markers
// <<<<<<< HEAD
import React from 'react';

function App() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      <a id="unrotate" href="#">rotate back</a>
      {/* ... other components ... */}
    </div>
  );
}

export default App;
// =======
// import React from 'react';

// function App() {
//   return (
//     <div>
//       <h1>Welcome to the App</h1>
//       <button id="unrotate" onClick={() => {/* some logic to rotate back */}}>rotate back</button>
//       {/* ... other components ... */}
//     </div>
//   );
// }

// export default App;
// >>>>>>> branch-name