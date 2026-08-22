import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element
// Fix language for the HTML root element

// Add the `lang` attribute to the HTML element for better accessibility
document.documentElement.lang = 'en';

const root = document.getElementById('root');
ReactDOM.render(<App />, root);
export default {};