import React, { useState } from 'react';

function Dashboard() {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <section>
        <h1>Error</h1>
        <pre>{error}</pre>
      </section>
    );
  }

  return (
    <main>
      <h1>Dashboard</h1>
    </main>
  );
}

function DashboardOther() {
  const [error, setError] = useState(null);

  if (error) {
    return (
      <section>
        <h1>Error</h1>
        <pre>{error}</pre>
      </section>
    );
  }

  return (
    <section>
      <h1>Other Dashboard</h1>
    </section>
  );
}

export { Dashboard, DashboardOther };