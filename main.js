import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import addLangAttribute from './addLangAttribute';
import fixTableStructure from './fixTableStructure';
import addMainLandmark from './addMainLandmark';
import fixLandmarkIssues from './fixLandmarkIssues';
import ensureUniqueLandmarks from './ensureUniqueLandmarks';
import uniqueLandmarks from './uniqueLandmarks';
import addSvgAccessibleNames from './addSvgAccessibleNames';
import addAccessibleNamesToSVGs from './addAccessibleNamesToSVGs';
import fixFakeLinkIssue from './fixFakeLinkIssue';
import fixFakeLinkIssues from './fixFakeLinkIssues';
import googleSignIn from './googleSignIn';
import fixButtonIdentifiers from './fixButtonIdentifiers';

// Add any other necessary functions here

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
    {/* Include Dashboard component if it's part of the same app and used inside App */}
    {/* <Dashboard /> */}
  </React.StrictMode>
);

// Call the reportWebVitals function to report the page's performance
reportWebVitals();