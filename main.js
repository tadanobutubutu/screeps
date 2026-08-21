// main.js
import React from 'react';
import ReactDOM from 'react-dom';

// Existing imports and component definitions...

// Assuming the Dashboard component is defined here
class Dashboard extends React.Component {
  // Existing component logic...

  render() {
    // Existing render logic...

    // The problematic code that causes multiple <main> elements
    // This needs to be refactored to avoid duplicate <main> elements
    return (
      <div>
        {this.state.error ? (
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
              {this.state.error}
            </pre>
            {/* ... rest of the error state code */}
          </main>
        ) : null}

        {this.state.success ? (
          <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
            {/* ... rest of the success state code */}
          </main>
        ) : null}

        {/* ... rest of the component */}
      </div>
    );
  }
}

// Existing render logic...