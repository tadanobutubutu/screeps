// Example main.js content after addressing the REACT_025 issue

import React from 'react';

function Dashboard() {
  const [error, setError] = React.useState(null);

  // ... other code ...

  return (
    <div>
      {error ? (
        // Replace the extra <main> with <section> for the error state
        <section aria-labelledby="error-heading">
          <h1 id="error-heading">Error</h1>
          {/* ... error content ... */}
        </section>
      ) : (
        // Keep the <main> for the success state
        <main>
          {/* ... success content ... */}
        </main>
      )}
    </div>
  );
}

export default Dashboard;