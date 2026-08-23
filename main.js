// Original code (left side of <<<<<<< HEAD)
import React from 'react';
// ... other imports ...
export default function Dashboard() {
  // ... other code ...
  if (error) {
    return (
      // ... error state JSX ...
      <main> <!-- Error message goes here --> </main>
    );
  }
  if (success) {
    return (
      // ... success state JSX ...
      <main> <!-- Success message goes here --> </main>
    );
  }
  // ... other code ...
}

// Proposed changes (right side of ======)
import React from 'react';
// ... other imports ...
export default function Dashboard() {
  // ... other code ...
  if (error) {
    return (
      // ... error state JSX ...
      <section> <!-- Error message goes here --> </section>
    );
  }
  if (success) {
    return (
      // ... success state JSX ...
      <section> <!-- Success message goes here --> </section>
    );
  }
  // ... other code ...
}