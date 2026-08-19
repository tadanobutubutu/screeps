// Original content from main.js
// <<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <div>
      <h1>Welcome to the App</h1>
      {/* App content */}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
// =======
// import React from 'react';
// import ReactDOM from 'react-dom';

// function App() {
//   return (
//     <main>
//       <h1>Welcome to the App</h1>
//       {/* App content */}
//     </main>
//   );
// }

// ReactDOM.render(<App />, document.getElementById('root'));
// >>>>>>> branch-name

// Updated content with new function or changes
import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <main>
      <h1>Welcome to the App</h1>
      {/* App content */}
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));