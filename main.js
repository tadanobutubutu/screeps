import React, { useState } from 'react';

const MyButton = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(count + 1);
  };

  return (
    <button
      onClick={incrementCount}
      aria-label="Increment count"
      aria-value={count}
      aria-live="polite"
    >
      Increment
    </button>
  );
};

export default MyButton;