import React from 'react';
import { landmarkList } from './landmarks';

const PrimaryContent = () => {
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
      <h1 id="main-title" tabIndex={-1}>Screeps Dashboard</h1>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
        <title>Screeps Dashboard</title>
        <text y="0.9em" fontSize="90">🐛</text>
      </svg>
      {/* Primary content goes here */}
    </main>
  );
};

const wrapPrimaryContentInMain = (Component) => {
  return () => {
    return (
      <div>
        <Component />
      </div>
    );
  };
};

const App = wrapPrimaryContentInMain(PrimaryContent);

export { PrimaryContent, wrapPrimaryContentInMain, landmarkList };
export default App;