import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Set the language attribute on the <html> element for accessibility
// This ensures screen readers use the correct language voice
if (document.documentElement && !document.documentElement.hasAttribute('lang')) {
  document.documentElement.setAttribute('lang', 'en');
}

const container = document.getElementById('root');
ReactDOM.render(<App />, container);

export { App };