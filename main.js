// Assuming `main.js` is the entry point of the React application and it's being modified
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Example of a component that uses an SVG with an accessible name
const IconComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      aria-label="Accessible SVG Icon"
    >
      <title>Screeps Dashboard</title>
      <text y="0.9em" fontSize="90">🐛</text>
    </svg>
  );
};

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);