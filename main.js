import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

hydrateRoot(
  document.documentElement.setAttribute('lang', 'en'),
  <React.StrictMode>
    <App />
  </React.StrictMode>
);