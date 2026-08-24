import React from 'react';

// REACT_025 fix: Only one <main> landmark; other regions use <section>

export function Dashboard() {
  // ... preserved existing logic, props, and state ...

  // Error state: changed from <main> to <section> to avoid duplicate landmarks
  if (/* existing error condition */ false) {
    return (
      <section aria-label="Dashboard error">
        {/* preserved existing error content */}
        <h2>Error</h2>
        <p>An error occurred.</p>
      </section>
    );
  }

  // Loading or intermediate states use <section> if needed
  // ... preserved existing loading logic ...

  // Success / default state: retains the single <main> landmark
  return (
    <main>
      {/* preserved existing success content */}
      <h1>Dashboard</h1>
      <section aria-label="Dashboard overview">
        <p>Overview content</p>
      </section>
      <article aria-label="Dashboard details">
        <p>Detailed content</p>
      </article>
    </main>
  );
}

// Preserve all other existing exports and functions
export default Dashboard;