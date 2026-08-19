// main.js - Adding lang attribute fix
// Note: The lang attribute should be added to the <html> element in your index.html file, not main.js

// If you need to set lang dynamically in React, you can do:
// document.documentElement.lang = "en";

// Example for a typical React setup:
// ReactDOM.createRoot(document.getElementById('root')).render(<App />);
// document.documentElement.lang = "en";

// If your main.js looks like:
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Add this line after render to set the lang attribute:
document.documentElement.lang = "en";

// If using older React (React 17 and below):
// import React from 'react';
// import ReactDOM from 'react-dom';
// import App from './App';

// ReactDOM.render(<App />, document.getElementById('root'));
// document.documentElement.lang = "en";