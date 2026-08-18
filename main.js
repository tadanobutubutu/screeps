import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

// Ensure both components are rendered
root.render(
  <React.StrictMode>
    {/* Keep the original main element as it seems to be a container for the App component */}
    <main role="main" lang="en">
      <App />
    </main>

    {/* Add the new additional component, assuming it's a child of the App component */}
    <div id="additional-component">
      {/* You may need to replace '<AdditionalComponent>' with the actual component name */}
      <AdditionalComponent />
    </div>
  </React.StrictMode>
);