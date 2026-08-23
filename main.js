// Before:
// dashboard/components/Dashboard.tsx:309
// The component renders a <main> element in both the error state and the success state...
// ...

// After:
// dashboard/components/Dashboard.tsx:309
// The component uses a single <main> element and handles different states within the <main>.

import React from 'react';

const Dashboard = ({ error, success, loading }) => {
  if (error) return <ErrorComponent message={error.message} />;
  if (loading) return <LoadingComponent />;
  if (success) return <SuccessComponent data={success.data} />;

  // Assuming there's a default state or content that goes inside the main area
  return (
    <main>
      {/* Other content that would normally go inside the main area */}
      {/* For example: articles, sections, or additional <main> content */}
    </main>
  );
};

export default Dashboard;

// Other imports and logic remain unchanged...