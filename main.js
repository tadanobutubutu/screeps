// main.js

// Import the necessary components from your project
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App'; // Replace with the actual path to your App component
import './index.css'; // Replace with the actual path to your CSS file

// Function to add the <main> element to the document
function addMainElement() {
  const mainElement = document.createElement('main');
  mainElement.innerHTML = document.body.innerHTML; // Copy the body content to the main element
  document.body.innerHTML = ''; // Clear the body content
  document.body.appendChild(mainElement); // Append the main element to the body
}

// Wrap the ReactDOM.render call with the addMainElement function
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
  () => {
    // Call the function to add the <main> element after the component has been rendered
    addMainElement();
  }
);