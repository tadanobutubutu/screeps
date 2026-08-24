// Main entry point for the Screeps bot repository
import React from 'react';
import ReactDOM from 'react-dom';
import DependencyGraphComponent from './components/DependencyGraphComponent';
import IndexComponent from './components/IndexComponent';

export default DependencyGraphComponent;
export default IndexComponent;

function App() {
  return (
    <div>
      <DependencyGraphComponent />
      <IndexComponent />
    </div>
  );
}

// Assuming that the Dashboard component is part of the components/ folder
// and that the issue is related to the Dashboard component, we will add a conditional rendering
// for the <main> element within the App component to handle the error and success states.
function Dashboard() {
  // Placeholder for the state that would determine the error or success state
  const isError = false; // This should be set based on actual application logic

  // Render logic for the Dashboard component
  return (
    <main>
      {isError ? (
        <div>Some error message or component</div>
      ) : (
        <div>Some success message or component</div>
      )}
    </main>
  );
}

// Replace the render logic for the App component to include the Dashboard component
function App() {
  return (
    <div>
      <DependencyGraphComponent />
      <IndexComponent />
      <Dashboard />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));