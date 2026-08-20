// Existing code in main.js (before conflict markers)
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;

// Conflict markers
<<<<<<< HEAD
// Potential conflict: Multiple <main> elements in Dashboard component
// >>>>>>> branch-name

// New code to resolve the issue
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ErrorPage from './components/ErrorPage'; // Assuming a new component is created to handle errors

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Dashboard} />
        <Route path="/error" component={ErrorPage} />
        <Route component={NotFound} />
      </Switch>
    </Router>
  );
}

export default App;

// Updated Dashboard component to handle error state properly
import React, { useState } from 'react';

const Dashboard = () => {
  const [error, setError] = useState(null);

  const handleError = (error) => {
    setError(error);
  };

  if (error) {
    return (
      <ErrorPage error={error} onRetry={handleError} />
    );
  }

  // ... rest of the Dashboard component code ...

  return (
    // ... rest of the Dashboard component code ...
  );
};

export default Dashboard;

// New ErrorPage component to replace the duplicated <main> element
import React from 'react';

const ErrorPage = ({ error, onRetry }) => {
  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1 style={{ color: '#b71c1c' }}>⚠️ エラー</h1>
      <pre
        tabIndex={0}
        aria-label="エラーメッセージ詳細"
        style={{
          color: '#c53030',
          backgroundColor: '#fff5f5',
          padding: '1rem',
          borderRadius: '4px',
          overflow: 'auto',
        }}
      >
        {error}
      </pre>
      <button
        onClick={onRetry}
        // ... rest of the button code ...
      >
        {copied ? '✅ コピー済み' : '📋 エラーをコピー'}
      </button>
      <button
        onClick={() => fetchStats(true)}
        disabled={refreshing}
        // ... rest of the button code ...
      >
        {refreshing ? '🔄 リフレッシュ中' : '🔄 リフレッシュ'}
      </button>
    </main>
  );
};

export default ErrorPage;