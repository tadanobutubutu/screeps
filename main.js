import React, { useState } from 'react';

// Dashboard component - fixed to have unique <main> landmark
export default function Dashboard() {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Error state - single <main> element
  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p>{error}</p>
      </main>
    );
  }

  // Success state - single <main> element
  if (success) {
    return (
      <main>
        <h1>Success</h1>
        <p>Operation completed successfully.</p>
      </main>
    );
  }

  // Default case
  return null;
}

// Export for compatibility
export { Dashboard };