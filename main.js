import React from 'react';

const MainPage = () => {
  return (
    <div>
      <h1>Main Page</h1>
      <button id="unrotate" onClick={() => console.log('Rotated')}>Rotate Back</button>
    </div>
  );
};

export default MainPage;