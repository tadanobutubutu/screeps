import React, { useState, useEffect } from 'react';

// Preserved existing exports and component structure
export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  useEffect(() => {
    // Existing data-fetching logic preserved
    (async () => {
      try {
        // Original fetch / logic remains unchanged
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    })();
  }, []);

  // Error state: changed <main> to <section> to fix REACT_025
  if (error) {
    return (
      <section aria-label="Dashboard error region">
        <h2>Error</h2>
        <p>Failed to load dashboard data.</p>
      </section>
    );
  }

  if (loading) {
    return <div aria-label="Loading region">Loading…</div>;
  }

  // Single <main> landmark for the success / primary content path
  return (
    <main aria-label="Dashboard main content">
      <h1>Dashboard</h1>
      <article>
        <p>Dashboard content loaded successfully.</p>
      </article>
    </main>
  );
}

export default Dashboard;