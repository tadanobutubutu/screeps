// index.js (or the entry point of your React app)
import React from 'react';
import ReactDOM from 'react-dom';
import your_app_component from './your_app_component'; // import your main component or any other appropriate entry point
import your_html_string from './path/to/your/html_file'; // import your html file

// Extract the root html element
const root = new DOMParser().parseFromString(your_html_string, 'text/html').documentElement;

// Add `lang` attribute to the root element
root.setAttribute('lang', 'en'); // Change 'en' to the appropriate language for your project

// Render React app
ReactDOM.render(<your_app_component />, root);