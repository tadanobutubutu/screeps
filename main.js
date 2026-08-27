// Before
import React from 'react';
import ErrorState from './ErrorState';
import SuccessState from './SuccessState';

const Dashboard = ({ error, success }) => {
  // ... other logic ...

  return (
    <div>
      {error && <ErrorState />}
      {success && <SuccessState />}
      {/* The following lines are problematic and need to be refactored */}
      {error && <main>Error message here</main>}
      {success && <main>Success message here</main>}
    </div>
  );
};

export default Dashboard;

// After
import React from 'react';
import ErrorState from './ErrorState';
import SuccessState from './SuccessState';

const Dashboard = ({ error, success }) => {
  // ... other logic ...

  const renderMainContent = () => {
    if (error) {
      return <main>Error message here</main>;
    } else if (success) {
      return <main>Success message here</main>;
    }
    return null;
  };

  return (
    <div>
      {error && <ErrorState />}
      {success && <SuccessState />}
      {/* Now we only render one main element based on the state */}
      {renderMainContent()}
    </div>
  );
};

export default Dashboard;