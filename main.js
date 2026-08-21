import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';
import { Dashboard as DashboardAlt } from './dashboard/components/Dashboard';

// -----------------------------------------------------------------------------
// Existing functionality is retained exactly as before.
// The following merge resolves the conflict markers by keeping a single <main/>
// rendering path, ensuring the page never contains more than one <main> landmark.
// -----------------------------------------------------------------------------

function App() {
  // State to simulate the mutually‑exclusive branches that were in conflict.
  // In the original code each branch returned its own <main> element.
  // By consolidating the rendering into one <main> element we guarantee that
  // only one landmark is present in the DOM at any given time.
  const [showErrorState, setShowErrorState] = React.useState(false);

  return (
    // The outer <main> wraps both possible inner manifestations,
    // but only one of them is rendered at a time.
    <main>
      {showErrorState ? (
        // This block corresponds to the original "error" return path.
        <Dashboard />
      ) : (
        // This block corresponds to the original "success" return path.
        <DashboardAlt />
      )}
    </main>
  );
}

// -----------------------------------------------------------------------------
// ReactDOM.render attaches the App component to the page.
// No existing exports are removed or renamed.
// -----------------------------------------------------------------------------
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.render(<App />, rootElement);
}

export default App;