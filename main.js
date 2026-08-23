tsx
// Import required components and dependencies
import React from 'react';
// ...

const Dashboard = () => {
  // Define state, functions, and variables as before...

  if (isError) {
    // Error state component, consolidate with success state for a single <main>
    return (
      <main>
        <h1>Error occurred</h1>
        {/* rest of the error state component */}
        {/* Add accessibility landmark for error message */}
        <section aria-live="polite">
          <p>Details: {errorMessage}</p>
        </section>
      </main>
    );
  }

  return (
    <main>
      {/* Success state component structure */}
      {/* Add accessibility landmark for success message */}
      <section aria-live="polite">
        <p>Success! {successMessage}</p>
      </section>
    </main>
  );
};

export default Dashboard;