// Your existing main.js content...

// New function to update posthog-js
async function initPosthog(options) {
    if (posthogInitialised) return;

    // Existing initialisation code...
    if (!options || !options.apiKey) {
        console.error('posthog-js initialization failed: apiKey is required');
        return;
    }

    try {
        const { integration, apiKey } = options;
        
        // Initialize the posthog instance with proper configuration
        const initInstance = posthog.init(apiKey, {
            api_host: options.apiHost || 'https://app.posthog.com',
            loaded: (posthog) => {
                // Custom initialization logic if needed
                if (typeof posthog === 'object') {
                    posthogInitialised = true;
                }
            }
        });

        // Add the new posthog instance to the global scope
        window.posthog = initInstance;
        
        return initInstance;
    } catch (error) {
        console.error('posthog-js initialization error:', error);
        throw error;
    }
}

// Call the new function and initialise posthog-js
initPosthog({ integration, apiKey });

// Your existing main.js content...