// main.js

// Existing code preserved
const img = document.getElementById('target');
let rotation = 0;

function rotate() {
    rotation += 90;
    img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
    rotation = 0;
    img.style.transform = `rotate(0deg)`;
}

// Attach event listeners
document.getElementById('rotate').addEventListener('click', rotate);
document.getElementById('unrotate').addEventListener('click', rotateBack);

// New code for fixing the REACT_025 issue
// Assuming that the <main> tag duplication is due to a component that renders different states with a <main> tag in each,
// we need to refactor this component to ensure that there is only one <main> tag in the component tree.

// Refactored Dashboard component
import React from 'react';

function Dashboard() {
  const [state, setState] = React.useState('loading'); // or 'error', 'success'

  const renderMainContent = () => {
    switch (state) {
      case 'loading':
        return <div>Loading...</div>;
      case 'error':
        return <div>Error occurred</div>;
      case 'success':
        return <div>Success!</div>;
      default:
        return null;
    }
  };

  return (
    <div>
      {/* Assuming other content here */}
      <main>{renderMainContent()}</main>
    </div>
  );
}

export default Dashboard;