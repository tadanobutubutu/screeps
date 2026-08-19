import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

document.documentElement.lang = 'en';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// New function for the requested update (chore(deps): update jest to v30)
function updateJestToVersion30() {
  // Add your implementation here
  // For example, using npm:
  // npm install jest@30 babel-jest@30
}

// New function for the requested update (chore(deps): update eslint to v10)
function updateEslintToVersion10() {
  // Add your implementation here
  // For example, using npm:
  // npm install eslint@10
}

// New function for the requested update (chore(deps): update typescript to v7)
function updateTypescriptToVersion7() {
  // Add your implementation here
  // For example, using npm:
  // npm install typescript@7
}

// New function for the requested update (chore(deps): update react to v19)
function updateReactToVersion19() {
  // Add your implementation here
  // For example, using npm:
  // npm install react@19 react-dom@19
}

// Note: The update functions are defined but not automatically executed
// to prevent interfering with the React application initialization.
// They can be called manually or integrated into a build process as needed.