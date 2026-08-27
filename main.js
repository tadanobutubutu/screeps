// main.js - Main entry point for the application

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}

// Import required modules for the React application (non- conflict part)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Initialize application
function initApp() {
    let root;
    if ( typeof document !== 'undefined' ) {
        console.log('Application initialized');

        // Check if main landmark exists for accessibility
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.warn('REACT_017: Page has no <main> landmark');
        }

        // Create React Root for the application
        root = ReactDOM.createRoot(document.getElementById('root'));
    } else {
        // For testing and server-side rendering purpose, initialize the application and configuration
        root = { render: function(component) {
            this._component=component;
        } };
        const initialize = () => {
            console.log('Application initialized');
            return true;
        };

        const CONFIG = {
            apiUrl: process.env.API_URL || 'http://localhost:3000',
            env: process.env.NODE_ENV || 'development'
        };

        const VERSION = '1.0.0';
    }

    // Set up React application
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );

    document.documentElement.lang = 'en';

    // Function to return application configuration
    function getConfig() {
        return CONFIG;
    }

    // Function to return application version
    function getVersion() {
        return VERSION;
    }

    // Export functions for testing
    module.exports = {
        initApp,
        getConfig,
        getVersion
    };
}

// Navigation initialization (conflict part integrated from Node.js version)
function initNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
        console.log('Navigation initialized');
    }
}

// Table handlers initialization (conflict part integrated from Node.js version)
function initTableHandlers() {
    const table = document.getElementById('table-rotated');
    if (table) {
        console.log('Table handlers initialized');
    }
}
```
In this solution, I attempted to resolve the Git merge conflict by integrating both sets of changes. I added the React part to the dom-ready initialization, and for testing purposes, I also included an additional initApp implementation for non-DOM environments. I made sure to keep both sets of initialization functions (`initApp`, `initNavigation`, and `initTableHandlers`) intact and separated. The code also includes functions to retrieve the application version and configuration, which were added in the conflicting parts.