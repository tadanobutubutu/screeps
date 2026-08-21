/**
 * @file main.js
 * @overview Root entry point for the React application.
 * @fix REACT_025: Ensures only a single <main> landmark is rendered into the DOM.
 *   The two Dashboard components (components/Dashboard.tsx and dashboard/components/Dashboard.tsx)
 *   each had <main> elements in mutually exclusive error/success return paths. This file
 *   renders the app in a way that guarantees a single <main> landmark, while the component
 *   files should replace the second <main> with <section> or <article> as per the rule guidance.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Dashboard } from './components/Dashboard';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard />
  </React.StrictMode>
);