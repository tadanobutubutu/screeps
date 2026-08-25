import React from 'react';

function App() {
  const unrotate = () => {
    // existing logic for rotating back
  };

  return (
    <div>
      <button type="button" id="unrotate" onClick={unrotate}>
        rotate back
      </button>
    </div>
  );
}

export default App;