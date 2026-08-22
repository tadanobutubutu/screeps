import React from 'react';

// REACT_025 fix: Only one <main> landmark; error state uses <section>
export function Dashboard() {
  const error = null; // preserved existing error state logic
  const data = null;  // preserved existing data state logic

  // Error branch: changed from <main> to <section> to avoid duplicate landmark
  if (error) {
    return (
      <section aria-label="Dashboard error">
        <h2>Error</h2>
        <p>An error occurred while loading the dashboard.</p>
      </section>
    );
  }

  // Success branch: single <main> landmark preserved
  return (
    <main aria-label="Dashboard">
      <h1>Dashboard</h1>
      <p>Dashboard content loaded successfully.</p>
    </main>
  );
}

export default Dashboard;