import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();

// Add the necessary new functions (without strict mode)
function addLangAttribute() {
  document.documentElement.lang = 'pt-BR';
}

function fixTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table) => {
    if (!table.tHead) {
      const head = document.createElement('thead');
      const firstRow = table.rows[0];
      if (firstRow) {
        head.appendChild(firstRow);
        table.appendChild(head);
      }
    }
    if (!table.tBodies.length) {
      const body = document.createElement('tbody');
      while (table.rows.length > 0) {
        body.appendChild(table.rows[0]);
      }
      table.appendChild(body);
    }
  });
}

function addMainLandmark() {
  if (!document.querySelector('main')) {
    const main = document.createElement('main');
    main.setAttribute('role', 'main');
    while (document.body.firstChild) {
      main.appendChild(document.body.firstChild);
    }
    document.body.appendChild(main);
  }
}

function fixAccessibility() {
  addLangAttribute();
  fixTableStructure();
  addMainLandmark();
}

document.addEventListener('DOMContentLoaded', () => {
  fixAccessibility();
});

export { addLangAttribute, fixTableStructure, addMainLandmark, fixAccessibility };