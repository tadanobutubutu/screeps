// Hypothetical original code with duplicate <main> elements
// This is just an example and may not match your actual code structure

// File: main.js
import React from 'react';
import ReactDOM from 'react-dom';

const Dashboard = () => {
  // ... some other code ...

  const renderMainContent = (error, data) => {
    if (error) {
      return <main>Error: {error.message}</main>;
    } else {
      return <main>Success: {data.result}</main>;
    }
  };

  return (
    <div>
      {/* ... other components */}
      {renderMainContent(error, data)}
    </div>
  );
};

ReactDOM.render(<Dashboard />, document.getElementById('root'));