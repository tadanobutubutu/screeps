// main.js - Application entry point

// Import required modules
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    appName: 'MyApp',
    version: '1.0.0',
    debug: process.env.NODE_ENV !== 'production'
};

// Utility functions
function log(message) {
    if (CONFIG.debug) {
        console.log(`[${CONFIG.appName}] ${message}`);
    }
}

function formatDate(date) {
    return new Date(date).toISOString().split('T')[0];
}

// Main application class
class Application {
    constructor() {
        this.startTime = Date.now();
        log('Application initialized');
    }

    run() {
        log('Running application...');
        this.greet();
        return true;
    }

    greet() {
        console.log(`Welcome to ${CONFIG.appName} v${CONFIG.version}!`);
    }

    getUptime() {
        return Date.now() - this.startTime;
    }
}

// Initialize and export
const app = new Application();

// Export for testing and external use
module.exports = {
    Application,
    app,
    CONFIG,
    log,
    formatDate
};

// Auto-run if executed directly
if (require.main === module) {
    app.run();
}