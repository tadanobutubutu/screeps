import React from 'react';

interface DashboardProps {
  // Add your props here
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  // Your existing state and logic here

  // Success state
  if (/* your success condition */) {
    return (
      <main>
        {/* Your success content */}
      </main>
    );
  }

  // Error state - now using section instead of main
  return (
    <section aria-label="Error content">
      {/* Your error content */}
    </section>
  );
};

export default Dashboard;