// Import necessary components and hooks
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';

// Import your component or components that use the link
import DependencyGraph from './docs/dependency-graph';

// Import your App component (or wherever you render your main layout)
import App from './App';

// Function to handle the rotate back action
const handleRotateBack = () => {
  // Logic to rotate back, for example:
  // window.history.back();
  // Or if it's a specific page state that needs to be reset:
  // useHistory().push('/some-path');
};

// Updated main.js
const main = () => {
  return (
    <Router>
      <App>
        <Switch>
          {/* Define your routes here */}
          {/* ... */}
          {/* Route for the dependency graph */}
          <Route path="/dependency-graph" component={DependencyGraph} />
          {/* ... */}
        </Switch>
        {/* Replace the anchor tag with a button */}
        <button onClick={handleRotateBack}>rotate back</button>
      </App>
    </Router>
  );
};

// Render the main application
ReactDOM.render(<main />, document.getElementById('root'));