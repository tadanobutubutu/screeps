// main.js (or index.js)
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import layout from './layout';
import dashboardLayout from './dashboard/layout';

function wrapContentWithMain() {
  const contentToWrap = document.querySelector('div.container'); // Assuming primary content is within a div with class 'container'
  if (contentToWrap) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(contentToWrap);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// Call the function to wrap the content with <main>
wrapContentWithMain();

// Add lang attribute to html element before rendering
document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);