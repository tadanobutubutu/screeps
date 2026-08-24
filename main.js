import React, { useState } from 'react';
import ErrorBoundary from './ErrorBoundary';

// Simulate some complex logic to determine state
const determineState = () => {
  // This function would contain real logic
  // For the purpose of this example, it will randomly return 'error' or 'success'
  return Math.random() > 0.5 ? 'error' : 'success';
};

const Dashboard = () => {
  const [state, setState] = useState('loading');
  const handleLoad = () => {
    const currentState = determineState();
    setState(currentState);
  };

  return (
    <div>
      <ErrorBoundary>
        <div>
          <button onClick={handleLoad}>Load Data</button>
        </div>
        {state === 'loading' && <div>Loading...</div>}
        {state === 'error' && <div>Something went wrong!</div>}
        {state === 'success' && <div>Data loaded successfully!</div>}
      </ErrorBoundary>
      {state === 'success' && (
        <main>
          <h1>Dashboard Main Content</h1>
          <p>Here is the main content of the dashboard.</p>
        </main>
      )}
    </div>
  );
};

export default Dashboard;