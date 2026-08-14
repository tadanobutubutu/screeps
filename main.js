// main.js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// New function to update posthog-js
let posthogInitialised = false;

function initInstance() {
    // Placeholder for PostHog initialization instance
    return {
        // Add PostHog methods and properties as needed
    };
}

async function initPosthog(options) {
    if (posthogInitialised) return;

    // Existing initialisation code...

    // Add the new posthog instance to the global scope
    window.posthog = initInstance;

    // Check if posthog has been injected into the global scope by another function (possibly in the same or different file)
    if (typeof posthog !== 'undefined') {
        // Ensure the global posthog instance is the one we've just created
        if (posthog !== initInstance) {
            // Report an error and log it if necessary
            console.error("Unexpected posthog instance detected. Inconsistency in PostHog initialization.");
        }
    } else {
        // Initialize PostHog as usual
        // (insert the existing initialisation code here)
    }

    posthogInitialised = true;
}

// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

module.exports = app;