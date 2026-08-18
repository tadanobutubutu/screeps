import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const lang = document.documentElement.lang || 'en';

hydrateRoot(
  container,
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

document.documentElement.setAttribute('lang', lang);