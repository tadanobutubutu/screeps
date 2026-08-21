tsx
// components/Dashboard.tsx
import React from 'react';

const Dashboard: React.FC = () => {
  // ... other component logic ...

  return (
    <div>
      {/* Assuming there's some navigation or header here */}
      <header>
        {/* Header content */}
      </header>

      {/* Unique main content, one per state */}
      <main style={{ padding: '2rem', fontFamily: 'monospace' }}>
        {/* Error state content */}
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

        {/* Success state content */}
        {success && (
          <>
            {/* ... success state content ... */}
          </>
        )}
      </main>

      {/* Other section content */}
      <section>
        {/* Section content */}
      </section>

      {/* ... other components or sections ... */}
    </div>
  );
};

export default Dashboard;