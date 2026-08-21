// Existing main.js content
// ...

// Add new functions or changes requested in the issue
// Example: If a new function is needed to handle the error state in Dashboard.tsx
function handleErrorMessage(error) {
    // Implementation for handling error message
    // ...
}

// Replace the duplicate <main> elements in Dashboard.tsx with <section> or <article>
// Ensuring proper landmark usage: <main> for primary content, <section> for subsections like errors
import React from 'react';

const Dashboard = ({ error, copied, errCopyHover, refreshing, fetchStats }) => {
    // Other component logic...

    return (
        <div>
            {/* Replace the duplicate <main> elements */}
            {error ? (
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
                    {/* ... rest of the error handling elements */}
                </section>
            ) : (
                <main>
                    {/* Main dashboard content - primary content landmark for accessibility */}
                    {/* Table and other dashboard content */}
                </main>
            )}
        </div>
    );
};

export default Dashboard;

// ...