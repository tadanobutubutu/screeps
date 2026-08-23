// main.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [rotated, setRotated] = useState(false);

  const handleRotate = () => {
    setRotated(!rotated);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img 
          src="https://reactjs.org/logo-og.png" 
          className={`App-logo ${rotated ? 'rotated' : ''}`} 
          alt="React logo" 
        />
        <p>
          Edit <code>src/App.js</code> and save to test HMR
        </p>
        <button id="unrotate" onClick={handleRotate}>
          rotate back
        </button>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;