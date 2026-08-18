import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Ensure the root HTML element has a language attribute for accessibility
// This satisfies REACT_015: <html> has no lang attribute
if (document.documentElement) {
  document.documentElement.setAttribute('lang', 'en');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);