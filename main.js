import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Main entry point - Accessibility: Ensure lang attribute is set on HTML element
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

// Accessibility: Ensure unique landmarks are used throughout the app
// - REACT_025: Ensure unique landmarks (2 issues) - landmarks should have unique accessible names
// - REACT_017: Add/fix 4 landmark issues - ensure proper landmark regions exist