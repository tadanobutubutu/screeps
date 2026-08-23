// Dashboard.tsx
import React from 'react';

const Dashboard = ({ error, success }) => {
  // ... other component logic ...

  return (
    <div>
      {/* Render the main content based on the component's state */}
      {error && <MainContent error={error} />}
      {success && <MainContent success={success} />}
    </div>
  );
};

// MainContent.tsx
import React from 'react';

const MainContent = ({ error, success }) => {
  // Determine which content to render based on the props
  const contentToRender = error ? <ErrorContent error={error} /> : success ? <SuccessContent success={success} /> : null;

  return (
    <main>
      {contentToRender}
    </main>
  );
};

// ErrorContent.tsx and SuccessContent.tsx
// ... component definitions for error and success content ...

export default Dashboard;