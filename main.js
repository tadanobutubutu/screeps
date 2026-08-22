import React, { useState } from 'react';

/**
 * Dashboard component demonstrating unique landmark compliance (REACT_025).
 * Uses <main> for primary content and <section> for secondary regions.
 */
const Dashboard = () => {
  const [status, setStatus] = useState('success');

  if (status === 'error') {
    return (
      <main>
        <h1>Error State</h1>
        <p>An error occurred while processing the request.</p>
      </main>
    );
  }

  return (
    <section>
      <h1>Success State</h1>
      <p>The operation completed successfully.</p>
    </section>
  );
};

export default Dashboard;