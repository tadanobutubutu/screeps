import React from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './components/Dashboard';

// Main entry point for the Screeps application
export default function App() {
  return <Dashboard />;
}

// ReactDOM setup from origin/main
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);