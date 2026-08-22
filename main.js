// TODO: Address accessibility issues from insight report: add ARIA attributes

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App aria-label="Main application" />, document.getElementById('root'));

// These are existing code and exports, no changes are made to them
const anExistingFunction = () => {};
const anotherExistingFunction = () => {};

// A new function with added ARIA attributes to fix accessibility issues
const createAccessibleButton = (text, id) => {
  const button = document.createElement('button');
  button.textContent = text;
  button.id = id;
  button.setAttribute('aria-label', `${text} button`);
  return button;
};

// Example of using the createAccessibleButton function
const myButton = createAccessibleButton('Click me', 'myButtonId');
document.body.appendChild(myButton);