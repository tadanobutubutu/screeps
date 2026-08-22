// Before:
// dashboard/components/Dashboard.tsx
import React from 'react';

const Dashboard = () => {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // ... other component logic ...

  return (
    <div>
      {error && <main>Error: {error.message}</main>}
      {success && <main>Success: {success.message}</main>}
    </div>
  );
};

export default Dashboard;

// After:
// dashboard/components/Dashboard.tsx
import React from 'react';

const Dashboard = () => {
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  // ... other component logic ...

  return (
    <div>
      {error && (
        <section>
          <h2>Error</h2>
          <p>{error.message}</p>
        </section>
      )}
      {success && (
        <section>
          <h2>Success</h2>
          <p>{success.message}</p>
        </section>
      )}
    </div>
  );
};

export default Dashboard;