// main.js - Application entry point

// Import necessary modules
const config = require('./config');
const logger = require('./logger');
const apiClient = require('./apiClient');

// Application state
let isInitialized = false;
let currentUser = null;

/**
 * Initialize the application
 */
function initialize() {
    try {
        logger.info('Initializing application');
        apiClient.configure(config.api);
        isInitialized = true;
        logger.info('Application initialized successfully');
        return true;
    } catch (error) {
        logger.error('Failed to initialize application:', error);
        return false;
    }
}

/**
 * Get current user information
 */
function getCurrentUser() {
    return currentUser;
}

/**
 * Authenticate user
 */
async function authenticate(username, password) {
    try {
        if (!isInitialized) {
            throw new Error('Application not initialized');
        }
        
        const user = await apiClient.authenticate(username, password);
        currentUser = user;
        logger.info(`User ${username} authenticated successfully`);
        return user;
    } catch (error) {
        logger.error('Authentication failed:', error);
        throw error;
    }
}

// TODO: Add back any required exports that might have been? - Removed export statement
module.exports = {
    initialize,
    getCurrentUser,
    authenticate,
    config,
    logger
};