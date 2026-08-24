import React from 'react';
import ReactDOM from 'react-dom';

function App() {
  return (
    <main aria-label="Main content">
      <div>
        <h1>Hello, world!</h1>
        {/* ... other components ... */}
      </div>
    </main>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));