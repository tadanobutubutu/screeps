tsx
import React, { useState } from 'react';

const Dashboard: React.FC = () => {
  // Existing code ...

  return (
    <div lang="en-US" style={{ padding: '2rem', fontFamily: 'monospace' }}>
      // Existing code ...

      {error && (
        <main tabIndex={0} role="alert">
          // ... keep the same structure as in the original code
        </main>
      )}
      {success && (
        <main tabIndex={0} role="region">
          // ... keep the same structure as in the original code
        </main>
      )}
      {!error && !success && (
        // This is where you might have other UI components
        // without rendering a main element
      )}
    </div>
  );
};

export default Dashboard;