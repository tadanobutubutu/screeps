// Address accessibility issues from insight report

import React from 'react';
import { landmarkList } from './landmarks'; // Assuming you have a landmarks file

// Example component that renders the primary content
const PrimaryContent = () => {
  // ... existing code

  // ADD YOUR CODE HERE
  // - Improve focus management for primary content
  //   https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
  const [isFirstFocus, setIsFirstFocus] = React.useState(true);

  React.useEffect(() => {
    if (isFirstFocus) {
      setTimeout(() => {
        document.getElementById('main-title').focus();
        setIsFirstFocus(false);
      }, 0);
    }
  }, []);

  return (
    // ... existing code
  );
};

// Your main component that will render the primary content wrapped in <main>
const MainComponent = () => {
  return (
    // ... existing code
  );
};

// Function to wrap the primary content in <main>
const wrapPrimaryContentInMain = (Component) => {
  return () => {
    return (
      // ... existing code
    );
  };
};

// Import landmarks and export the PrimaryContent component so it can be imported independently
import { landmarkList } from './landmarks';
export const PrimaryContent = PrimaryContent;

// Export the wrapPrimaryContentInMain function for usage elsewhere
export const wrapPrimaryContentInMain = wrapPrimaryContentInMain;

// Wrap the PrimaryContent component by default when exported
export default wrapPrimaryContentInMain(PrimaryContent);