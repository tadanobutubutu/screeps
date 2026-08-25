// Address accessibility issues from insight report
import React from 'react';
import { landmarkList } from './landmarks';

// Example component that renders the primary content
const PrimaryContent = () => {
  // Improve focus management for primary content
  // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
  const [isFirstFocus, setIsFirstFocus] = React.useState(true);

  React.useEffect(() => {
    if (isFirstFocus) {
      setTimeout(() => {
        const mainTitle = document.getElementById('main-title');
        if (mainTitle) {
          mainTitle.focus();
        }
        setIsFirstFocus(false);
      }, 0);
    }
  }, []);

  return (
    <main id="main-content" role="main">
      <h1 id="main-title">Screeps Dashboard</h1>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <title>Screeps Dashboard</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {/* Primary content goes here */}
    </main>
  );
};

// Function to wrap the primary content in <main> landmark
const wrapPrimaryContentInMain = (Component) => {
  return () => {
    return (
      <Component />
    );
  };
};

// Main App component
const App = () => {
  return (
    <div>
      <wrapPrimaryContentInMain(PrimaryContent) />
    </div>
  );
};

// Export the PrimaryContent component so it can be imported independently
export const PrimaryContent = PrimaryContent;

// Export the wrapPrimaryContentInMain function for usage elsewhere
export const wrapPrimaryContentInMain = wrapPrimaryContentInMain;

// Wrap the PrimaryContent component by default when exported
export default wrapPrimaryContentInMain(PrimaryContent);