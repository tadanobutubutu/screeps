// main.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// Importing and rendering the Dashboard component
import Dashboard from './components/Dashboard';

// This is a placeholder for the existing code that renders the Dashboard
// It is assumed that the Dashboard component is rendered somewhere in the application
// For the purpose of this example, we'll just import it and not render it here
// import dashboardComponent from './components/Dashboard';
// ReactDOM.render(<Dashboard />, document.getElementById('dashboard-root'));