import React from 'react';
import ReactDOM from 'react-dom/client';

function App() {
  return (
    <button id="unrotate" onClick={() => console.log('rotate back')}>
      Rotate Back
    </button>
  );
}

export default App;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);