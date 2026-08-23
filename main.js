import React from 'react';
import ReactDOM from 'react-dom';

// Assuming there are components called Dashboard and ErrorDashboard
import Dashboard from './components/Dashboard';
import ErrorDashboard from './dashboard/components/Dashboard';

const App = () => {
  return (
    <main>
      {/* Assuming we have a function that determines if there is an error or not */}
      {isThereAnError ? <ErrorDashboard /> : <Dashboard />}
    </main>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));