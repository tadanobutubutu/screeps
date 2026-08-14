// Your existing main.js content...

// New function to update posthog-js
async function initPosthog(options) {
    if (posthogInitialised) return;

    // Existing initialisation code...

    // Add the new posthog instance to the global scope
    window.posthog = initInstance;
}

// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

// Your existing main.js content...

// Fix for unterminated comment in utils.tasks.js
// This is a placeholder for the actual fix needed in utils.tasks.js
// The actual fix would involve properly terminating any open comments in that file