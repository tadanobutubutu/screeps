import React from 'react';

const MyComponent = () => {
  // Hypothetical function to simulate an input with a missing 'lang' attribute
  const handleInputChange = (event) => {
    // Some logic
  };

  return (
    <input type="text" onChange={handleInputChange} /> // Missing 'lang' attribute
  );
};

export default MyComponent;