// main.js - Application Entry Point

// TODO: This is the existing code that needs to be preserved (This comment remains as-is)

// Import required modules
const express = require('express');
const path = require('path');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the application');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for testing
module.exports = app;