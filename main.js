import React from 'react';

// Existing exports and functions preserved
// (other code from main.js remains unchanged below)

export function Dashboard({ errorState, successData }) {
  // REACT_025 fix: use a single <main> landmark.
  // The other regions use <section> instead of a second <main>.
  return (
    <main aria-label="Dashboard">
      {errorState ? (
        <section aria-label="Error region">
          <h2>Error</h2>
          <p>Something went wrong.</p>
        </section>
      ) : (
        <section aria-label="Dashboard content">
          <h2>Dashboard</h2>
          <p>Data loaded successfully.</p>
        </section>
      )}
    </main>
  );
}

export default Dashboard;