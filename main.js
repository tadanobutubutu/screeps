// main.js - Application entry point
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles.css';

ReactDOM.render(<App />, document.getElementById('root'));

// App.js - Main application component
import React, { useState } from 'react';

function App() {
  const [isRotated, setIsRotated] = useState(false);

  const handleRotate = () => {
    setIsRotated(!isRotated);
  };

  return (
    <div className="container">
      <div className={`image-wrapper ${isRotated ? 'rotated' : ''}`}>
        <img src="/image.jpg" alt="Rotatable image" />
      </div>
      
      <div className="controls">
        <button onClick={handleRotate}>
          Rotate Image
        </button>
        
        {isRotated && (
          <button id="unrotate" onClick={handleRotate}>
            rotate back
          </button>
        )}
      </div>
    </div>
  );
}

export default App;