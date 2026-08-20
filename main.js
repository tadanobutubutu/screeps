// main.js

// Preserve existing code
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// Add new functions or changes requested in the issue

// Assuming there's a function that could be causing the duplication of <main> elements
// Let's refactor this hypothetical function to ensure that there's only one <main> element

function renderDashboardState(state) {
  if (state === 'error') {
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
        {/* ... rest of the error state code */}
      </main>
    );
  } else if (state === 'success') {
    return (
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* ... rest of the success state code */}
      </main>
    );
  }
}

// Now, in your component, use this function instead of directly rendering two <main> elements
// For example:
// <DashboardComponent state={dashboardState} />
// And in the DashboardComponent render method, call renderDashboardState with the current state

// Do NOT remove or rename any existing exports

// Output the complete updated main.js content