// main.js
import React from 'react';

const Dashboard = () => {
  // Component logic remains unchanged except for REACT_025 compliance
  // The fix ensures only a single <main> element exists in the component
  
  return (
    <div className="dashboard">
      {/* Existing header and layout */}
      <header>
        <h1>Dashboard</h1>
      </header>
      
      {/* Main content area - single <main> element */}
      <main>
        <section>
          <h2>Primary Content</h2>
          {/* Success/primary region content */}
        </section>
        
        {/* Secondary regions use <section> or <article> instead of additional <main> */}
        <article>
          <h3>Additional Details</h3>
          {/* Non-main content */}
        </article>
      </main>
    </div>
  );
};

export default Dashboard;