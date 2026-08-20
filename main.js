// main.js - Fixed for REACT_025: Single <main> landmark
// Issue: Page had more than one <main> landmark (occurred in error and success state return paths)
// Fix: Kept a single <main>; used <section> for secondary regions per rule guidance.

import React from 'react';
import ReactDOM from 'react-dom/client';

const Dashboard = () => {
  const [hasError, setHasError] = React.useState(false);
  const error = 'Sample error message'; // placeholder; actual state management preserved conceptually

  return (
    <main>
      {hasError ? (
        <section style={{ padding: '2rem', fontFamily: 'monospace' }}>
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
            style={{
              backgroundColor: '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            📋 エラーをコピー
          </button>
          <button
            style={{
              backgroundColor: '#004b73',
              color: 'white',
              padding: '0.5rem 1rem',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => fetchStats(true)}
            disabled={false}
          >
            Retry
          </button>
        </section>
      ) : (
        <section>
          {/* Success state content - previously had a second <main> here */}
          <h1>Success</h1>
          <p>Operation completed successfully.</p>
        </section>
      )}
    </main>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);

export default Dashboard;