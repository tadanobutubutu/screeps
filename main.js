// Original main.js content with conflict markers
// <<<<<<< HEAD
import React from 'react';
import { useState } from 'react';

const MainComponent = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={incrementCount}>Increment</button>
    </div>
  );
};

export default MainComponent;
// =======
// Changes requested in the issue
// >>>>>>> branch-name
// <<<<<<< HEAD
// >>>>>>> branch-name
// Add a new function to handle decrementing the count
const decrementCount = () => {
  setCount(count - 1);
};

// Update the MainComponent to include the decrement button
const MainComponent = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  const decrementCount = () => {
    setCount(count - 1);
  };

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={incrementCount}>Increment</button>
      <button onClick={decrementCount}>Decrement</button>
    </div>
  );
};

export default MainComponent;
// =======
// >>>>>>> branch-name