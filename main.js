const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// TODO: This is the existing code that needs to be preserved

// Sample function that should be preserved
function getWelcomeMessage() {
    return 'Welcome to the application';
}

// Export the app for testing
module.exports = app;

// Start server if run directly
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}