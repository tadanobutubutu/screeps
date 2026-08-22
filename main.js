// Ensure the HTML element has the correct language attribute for accessibility
document.documentElement.setAttribute('lang', 'en');

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<App />);

export { root };