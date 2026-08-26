import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// ... other imports and code ...

// Assuming the following main.js content

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// ... rest of the main.js content ...

// Hypothetical App component (updated to have only one <main> element)

const App = () => {
  // ... other component logic ...

  return (
    <div>
      {/* Assuming Dashboard is passed as a prop or imported here */}
      {/* Merge both Dashboards, preserving the <main> from StrictMode and the conditional logic from the original Dashboard component */}
      {React.fragment(
        <main key="dashboard">
          {/* Error state logic */}
          {error && (
            <>
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
            </>
          )}

          {/* Success state logic */}
          {/* ... */}
        </main>
      )}
    </div>
  );
};

// Hypothetical Dashboard component (updated to use a non-conflicting element instead of <main>)

const Dashboard = ({ error, refreshing, copied, errCopyHover, errRetryHover, copyErr, fetchStats }) => {
  // ... component logic ...

  return (
    <div>
      {/* Merge the non-conflicting element and the <main> copy from the merged App component */}
      <div id="dashboard-container">
        {error && (
          <main id="dashboard">
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
    </div>
  );
};

// ... rest of the main.js content ...