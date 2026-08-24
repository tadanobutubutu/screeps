// Assuming the original code looked something like this:
// return (
//   <main>Error content</main>
// );

// Refactored code:
import React from 'react';
import ErrorContent from './ErrorContent'; // New component for error content
import SuccessContent from './SuccessContent'; // New component for success content

const Dashboard = ({ isError }) => {
  return (
    <main>
      {isError ? <ErrorContent /> : <SuccessContent />}
    </main>
  );
};

export default Dashboard;

// ErrorContent.tsx
import React from 'react';

const ErrorContent = () => {
  return <div>Error content here</div>;
};

export default ErrorContent;

// SuccessContent.tsx
import React from 'react';

const SuccessContent = () => {
  return <div>Success content here</div>;
};

export default SuccessContent;