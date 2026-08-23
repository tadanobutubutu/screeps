import React from 'react';

function Component() {
  // ... existing code ...

  // Assuming there is an error handling section that was wrapped in <main>
  if (error) {
    return (
      <section aria-labelledby="error-heading">  // Use <section> instead of <main>
        <h1 id="error-heading">Error</h1>
        {/* ... error content ... */}
      </section>
    );
  }

  // Assuming there is a success content section that was also wrapped in <main>
  return (
    <main>
      {/* ... success content ... */}
    </main>
  );
}

// ... other components and code ...

export default Component;