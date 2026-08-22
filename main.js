// Example of a hypothetical main.js file with conflict markers
/*
<<<<<<< HEAD
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
*/
// >>>>>>> branch-name

// Update to include a <main> element for React components
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';

// Wrap the App component with a <main> tag
const MainComponent = () => (
  <main>
    <Router>
      <App />
    </Router>
  </main>
);

ReactDOM.render(<MainComponent />, document.getElementById('root'));