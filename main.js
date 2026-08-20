import React from 'react';

const Main = () => {
  // Fixed REACT_036: replaced <a href="#"> with <button>
  return (
    <button id="unrotate" onClick={() => console.log('rotate back')}>
      rotate back
    </button>
  );
};

export default Main;