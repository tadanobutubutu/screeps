// main.js
import React from 'react';

// Preserve all existing imports and components
// ... (keep all your existing imports and code)

// The fix involves restructuring your component to have a single <main> element
// that wraps all conditional content, replacing any secondary <main> elements
// with appropriate semantic HTML elements like <section> or <article>

const MainComponent = () => {
  // Preserve all your existing state and logic
  // ... (keep all your existing state and logic)

  // Example of the fixed structure:
  return (
    <main>
      {/* Error state content */}
      {error && (
        <section className="error-state">
          {/* Your error content here */}
        </section>
      )}

      {/* Success state content */}
      {!error && (
        <section className="success-state">
          {/* Your success content here */}
        </section>
      )}
    </main>
  );

  // Or if you need to preserve some existing structure:
  /*
  return (
    <main>
      {error ? (
        <section className="error-state">
          {/* Your error content here *}
        </section>
      ) : (
        <article className="success-state">
          {/* Your success content here *}
        </article>
      )}
    </main>
  );
  */
};

// Preserve all your existing exports
// ... (keep all your existing exports)