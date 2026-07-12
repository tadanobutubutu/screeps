/**
 * Deployment utility for Screeps AI.
 */

const logger = require('./utils.logging');

/**
 * Injects environment variables into the deployment configuration.
 * @param {Object} config - The configuration object to inject into.
 * @returns {Object} The updated configuration object.
 */
function injectEnvVars(config) {
    if (!config || typeof config !== 'object') {
        return config;
    }

    const envVars = {
        SCREEPS_TOKEN: process.env.SCREEPS_TOKEN,
        SCREEPS_USERNAME: process.env.SCREEPS_USERNAME,
        DASHBOARD_SECRET: process.env.DASHBOARD_SECRET,
    };

    return { ...config, ...envVars };
}

/**
 * Sanitizes a log message by redacting sensitive information.
 * @param {string} message - The log message to sanitize.
 * @returns {string} The sanitized log message.
 */
function sanitizeLog(message) {
    if (typeof message !== 'string') {
        return message;
    }

    // Redact common sensitive keywords
    const keywords = ['token', 'password', 'apikey', 'secret', 'credential'];
    let sanitized = message;

    keywords.forEach((keyword) => {
        const regex = new RegExp(keyword, 'gi');
        sanitized = sanitized.replace(regex, '[REDACTED]');
    });

    return sanitized;
}

module.exports = {
    injectEnvVars,
    sanitizeLog,
};
