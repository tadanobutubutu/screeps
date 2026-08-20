import React, { useState, useEffect, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <html lang="en">
      <body>
        <App />
      </body>
    </html>
  </React.StrictMode>
);