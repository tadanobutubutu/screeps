import React from 'react';

// PRESERVED: existing exports and helper functions
export const version = '1.0.0';

function helper() {
  return null;
}

export function sideComponent() {
  return <div>Side</div>;
}

export default function Dashboard({ error, children }) {
  // Error state: use <section> instead of <main> to keep only one landmark
  if (error) {
    return (
      <section aria-label="Dashboard error">
        <h1>Error</h1>
        <p>Unable to load dashboard.</p>
      </section>
    );
  }

  // Success state: single primary <main> landmark
  return (
    <main aria-label="Dashboard">
      <header>
        <h1>Dashboard</h1>
      </header>
      <section>
        {children}
      </section>
    </main>
  );
}