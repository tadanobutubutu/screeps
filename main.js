const fs = require('fs');
const path = require('path');

function readConfig(configPath) {
    try {
        const data = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config:', error);
        return null;
    }
}

function saveConfig(configPath, config) {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config:', error);
        return false;
    }
}

function processData(data) {
    if (!data) return null;
    return data.map(item => ({
        ...item,
        processed: true,
        timestamp: Date.now()
    }));
}

function validateInput(input) {
    if (typeof input !== 'string') {
        throw new Error('Input must be a string');
    }
    return input.trim();
}

function getAppRoot() {
    return path.resolve(__dirname);
}

function formatDate(date) {
    return new Date(date).toISOString();
}

module.exports = {
    readConfig,
    saveConfig,
    processData,
    validateInput,
    getAppRoot,
    formatDate
};