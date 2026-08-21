// Assuming the main component file is 'MainComponent.tsx'
// and the file with the duplicate <main> is 'Dashboard.tsx'

// main.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import MainComponent from './MainComponent'; // The main component file
import Dashboard from './Dashboard'; // The file with the duplicate <main>

const App = () => {
  return (
    <Router>
      <MainComponent />
      {/* Remove the duplicate <main> element from Dashboard */}
      {/* <Dashboard /> */}
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));