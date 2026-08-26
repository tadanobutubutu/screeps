// TODO: Please provide the actual contents of main.js
// I need to see the file to identify what exports are missing and resolve the TODO on line 33

const fs = require('fs');
const path = require('path');

function readConfig() {
    try {
        const data = fs.readFileSync(path.join(getAppRoot(), 'config.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading config:', error);
        return null;
    }
}

function saveConfig(config) {
    try {
        fs.writeFileSync(path.join(getAppRoot(), 'config.json'), JSON.stringify(config, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving config:', error);
        return false;
    }
}

// TODO: resolve missing exports
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
    return process.cwd();
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