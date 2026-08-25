// Address accessibility issues from insight report
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

import React from 'react';
import { landmarkList } from './landmarks';

// Function to add lang attribute to HTML element for accessibility (REACT_015)
export const addLangAttribute = (Component, lang = 'en') => {
  return function WrappedComponent(props) {
    React.useEffect(() => {
      document.documentElement.lang = lang;
    }, [lang]);

    return <Component {...props} />;
  };
};

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
        ...
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

// Export the PrimaryContent component so it can be imported independently
export const PrimaryContent = PrimaryContent;

// Export the wrapPrimaryContentInMain function for usage elsewhere
export const wrapPrimaryContentInMain = wrapPrimaryContentInMain;

// Wrap the PrimaryContent component by default when exported
export default addLangAttribute(wrapPrimaryContentInMain(PrimaryContent));