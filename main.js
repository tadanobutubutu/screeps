import React from 'react';
import ReactDOM from 'react-dom';

function rotateBack() {
  // existing logic for rotating back
}

export default function App() {
  const handleUnrotate = () => {
    rotateBack();
  };

  return (
    <div>
      <button id="unrotate" onClick={handleUnrotate}>rotate back</button>
    </div>
  );
}

const container = document.getElementById('root');
ReactDOM.render(<App />, container);