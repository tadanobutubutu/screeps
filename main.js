import React from 'react';

// ... existing imports

const Dashboard = () => {
  // ... existing code

  const [error, setError] = useState(null);
  // ... existing error handling code

  return (
    // Wrap both error and success state self-closing JSX elements in one parent element (e.g., <div>)
    <div>
      <div className="Landing">
        {/* ... existing Landing JSX elements */}
      </div>
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {error ? (
          // Put error-related elements inside JSX conditionally
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
            // ... other error-related elements
          </>
        ) : (
          // Move success-related elements outside the condition
          <>
            <SignupForm />
            <Result />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;