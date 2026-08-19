import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Set language attribute for accessibility
document.documentElement.lang = 'en';

// Update th tags with scope attribute
function updateThTags() {
  const thElements = document.querySelectorAll('th');
  thElements.forEach(th => {
    if (!th.hasAttribute('scope')) {
      th.setAttribute('scope', 'col');
    }
  });
}

// Call update function when DOM is loaded
document.addEventListener('DOMContentLoaded', updateThTags);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);