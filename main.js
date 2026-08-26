// Import required libraries
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// Import or keep your existing component, e.g., MyComponent
import MyComponent from './MyComponent';

// TODO: Implement createInPageButton functionality
const createInPageButton = (buttonText) => {
  const btn = document.createElement('button');
  btn.textContent = buttonText;
  btn.addEventListener('click', () => {
    // TODO: Add your custom functionality here when the button is clicked.
    console.log('Button clicked!');
  });

  // Append the new button to the body of the document
  document.body.appendChild(btn);
};

// PRESERVE all existing code, exports, and functions from current main.js.
// ONLY ADD the new function createInPageButton and its related scope.

// Example usage of createInPageButton function:
const myButton = document.getElementById('my-button');
createInPageButton('Hello World');
myButton.remove();

// Do NOT remove or rename any existing exports.
export default {
  createInPageButton
};