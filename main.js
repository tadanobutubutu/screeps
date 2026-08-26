// Assuming the following imports and existing code in main.js

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// ... other imports and code ...

// This is the hypothetical main.js content

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of the main.js content ...

// Hypothetical App component (assuming it's where Dashboard is rendered)

const App = () => {
  // ... other component logic ...

  return (
    <div>
      {/* Assuming Dashboard is passed as a prop or imported here */}
      <Dashboard />
    </div>
  );
};

// Hypothetical Dashboard component (updated to have only one <main> element)

const Dashboard = ({ error, refreshing, copied, errCopyHover, errRetryHover, copyErr, fetchStats }) => {
  // ... component logic ...

  return (
    <div>
      {/* Error state logic */}
      {error && (
        <main>
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
          {/* ... other error state elements ... */}
        </main>
      )}

      {/* Success state logic */}
      {/* ... */}
    </div>
  );
};

// ... rest of the main.js content ...

// Note: The above Dashboard component assumes that the success state logic
// does not contain a <main> element. If it does, you will need to refactor that
// logic to remove the duplicate <main> element or replace it with a different
// landmark element such as <section> or <article> as suggested.

// Make sure to update the tests in /tests/ to reflect these changes and continue to pass.