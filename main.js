// main.js

import React from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './components/Dashboard';

// Assuming the Dashboard component has a prop that determines the state
// and that this state is being managed by a parent component or the state itself

const renderDashboard = (dashboardState) => {
  ReactDOM.render(
    <React.StrictMode>
      <Dashboard dashboardState={dashboardState} />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

// Initial render with the default state or based on application logic
renderDashboard('initialState');

// If you have a method to update the dashboard state, you would call this
// and re-render the component with the updated state
// renderDashboard('updatedState');