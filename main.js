import './styles.css';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { CONFIG } from './utils/constants';
import { isSecureContext } from './utils.js';
import a11y from './AccessibilityUtilities';
import APP from './App';
import reportWebVitals from 'node-libs-react/report-validator';

const express = require('express');
const path = require('path');

const config = {
  apiUrl: process.env.API_URL || 'http://localhost:3000',
  timeout: 5000
};

const appState = {
  initialized: false,
  data: null,
  cache: new Map()
};

function initialize() {
  appState.initialized = true;
  console.log('App initialized');
}

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.all('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`App listening on port ${process.env.PORT || 3000}!`);
});

function render() {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<APP />);
}

function handleAccessibilityIssues() {
  a11y.validateAccessibility();
}

if (typeof isSecureContext === 'function' && isSecureContext()) {
  initialize();
  render();
} else if (typeof window !== 'undefined' && window.isSecureContext !== false) {
  initialize();
  render();
} else {
  console.warn('Application is not running in a secure context. Some features may not be available.');
}

reportWebVitals();