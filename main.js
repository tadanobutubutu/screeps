import React from 'react';

/**
 * Dashboard component with unique landmarks compliance
 * Fixes REACT_025: Ensures only one <main> element exists in the component
 */
export const Dashboard = () => {
  // Component logic - single main element used for both error and success states
  return (
    <div className="dashboard">
      {/* Single <main> element - wraps both error and success content */}
      <main>
        {/* Error region - previously had its own <main> */}
        {isError && (
          <section aria-labelledby="error-heading">
            <h2 id="error-heading">Error State</h2>
            <p>An error occurred during processing.</p>
          </section>
        )}

        {/* Success region - previously had its own <main> */}
        {!isError && (
          <section aria-labelledby="success-heading">
            <h2 id="success-heading">Success State</h2>
            <p>Operation completed successfully.</p>
          </section>
        )}
      </main>

      {/* Other regions use <section> or <article> instead of <main> */}
      <article id="summary">
        <h3>Summary</h3>
        <p>This section provides a summary of the dashboard functionality.</p>
      </article>

      <section id="features">
        <h3>Features</h3>
        <ul>
          <li>Real-time data visualization</li>
          <li>Interactive charts</li>
          <li>Responsive design</li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;