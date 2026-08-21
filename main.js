tsx
// Assuming this is part of a larger component file

import React from 'react';

const MainComponent: React.FC = ({ children }) => {
  return (
    <main>
      {children}
    </main>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <MainComponent>
        {/* Your primary content goes here */}
        <h1>Welcome to My App</h1>
        <p>This is the main content of the page.</p>
      </MainComponent>
    </div>
  );
};

export default App;