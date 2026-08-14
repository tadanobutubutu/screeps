// main.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New function to update posthog-js
async function initPosthog(options) {
    if (posthogInitialised) return;

    // Existing initialisation code...

    // Add the new posthog instance to the global scope
    window.posthog = initInstance;
}

// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

module.exports = app;