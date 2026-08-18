import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <main role="main" lang="en">
      <App />
    </main>
    <div id="additional-component">
      {/* You may need to replace '<AdditionalComponent>' with the actual component name */}
      <AdditionalComponent />
    </div>
  </React.StrictMode>
);