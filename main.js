// main.js - Entry point for the application

const express = require('express');
const app = express();

// TODO: Update or create the affected functions to be accessible
// Line 14: Update or create the affected functions to be accessible

// Helper functions
function processData(data) {
    return data.map(item => item * 2);
}

function validateInput(input) {
    if (!input || typeof input !== 'string') {
        return false;
    }
    return true;
}

function formatResponse(success, data, message) {
    return {
        success: success,
        data: data,
        message: message || ''
    };
}

// Express routes
app.get('/', (req, res) => {
    res.json(formatResponse(true, { status: 'running' }, 'Server is running'));
});

app.post('/api/process', (req, res) => {
    const { data } = req.body;
    if (!validateInput(data)) {
        return res.status(400).json(formatResponse(false, null, 'Invalid input'));
    }
    const processed = processData(data);
    res.json(formatResponse(true, processed, 'Data processed successfully'));
});

// Export functions to make them accessible
module.exports = {
    processData,
    validateInput,
    formatResponse,
    app
};