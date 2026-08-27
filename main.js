// main.js - Main entry point for the application

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', initApp);
}

// Import required modules for the React application
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Initialize application
function initApp() {
    let root;
    if (typeof document !== 'undefined') {
        console.log('Application initialized');

        // Check if main landmark exists for accessibility
        const mainElement = document.querySelector('main');
        if (!mainElement) {
            console.warn('REACT_017: Page has no <main> landmark');
        }

        // Create React Root for the application
        root = ReactDOM.createRoot(document.getElementById('root'));

        // Initialize navigation and table handlers
        initNavigation();
        initTableHandlers();
    } else {
        // For testing and server-side rendering purpose, initialize the application and configuration
        root = { render: function(component) {
            this._component = component;
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

// Navigation initialization
function initNavigation() {
    const nav = document.querySelector('nav');
    if (nav) {
        console.log('Navigation initialized');
    }
}

// Table handlers initialization
function initTableHandlers() {
    const table = document.getElementById('table-rotated');
    if (table) {
        console.log('Table handlers initialized');
    }
}