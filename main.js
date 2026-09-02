// TODO: Add back any required exports that might have been removed
// TODO: This is the existing code that needs to be preserved
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// TODO: Implement this function for creating in-page buttons
function createInPageButton(buttonId, buttonText, buttonClass) {
    const button = document.createElement('button');
    button.id = buttonId;
    button.textContent = buttonText;
    button.className = buttonClass;
    return button;
}

// Function to validate landmark structure for accessibility issues
function validateLandmarkStructure() {
    const requiredLandmarks = ['header', 'main', 'footer'];
    const missingLandmarks = [];

    requiredLandmarks.forEach(landmark => {
        if (!document.querySelector(landmark)) {
            missingLandmarks.push(landmark);
        }
    });

    if (missingLandmarks.length > 0) {
        console.warn(`Accessibility warning: Missing required landmarks: ${missingLandmarks.join(', ')}`);
        return false;
    }

    return true;
}

// Function to handle extension upgrade logic
function handleUpgrade() {
    const currentVersion = '1.0.0';
    const storedVersion = localStorage.getItem('extensionVersion');

    if (!storedVersion) {
        // First installation - initialize settings
        initializeDefaultSettings();
        localStorage.setItem('extensionVersion', currentVersion);
        console.log('Extension initialized for first use');
        return;
    }

    if (storedVersion !== currentVersion) {
        // Upgrade detected - run upgrade logic
        performUpgradeTasks(storedVersion, currentVersion);
        localStorage.setItem('extensionVersion', currentVersion);
        console.log(`Extension upgraded from ${storedVersion} to ${currentVersion}`);
    }
}

// Initialize default settings for new installations
function initializeDefaultSettings() {
    const defaultSettings = {
        theme: 'light',
        notifications: true,
        autoSave: true,
        language: 'en'
    };

    Object.keys(defaultSettings).forEach(key => {
        if (localStorage.getItem(key) === null) {
            localStorage.setItem(key, JSON.stringify(defaultSettings[key]));
        }
    });
}

// Perform upgrade tasks based on version differences
function performUpgradeTasks(oldVersion, newVersion) {
    const upgradeTasks = {
        migrateSettings: () => {
            // Migrate any settings that need transformation
            const existingSetting = localStorage.getItem('oldSettingKey');
            if (existingSetting) {
                localStorage.setItem('newSettingKey', existingSetting);
                localStorage.removeItem('oldSettingKey');
            }
        },
        clearCache: () => {
            // Clear temporary cache files
            sessionStorage.clear();
        },
        updatePreferences: () => {
            // Update user preferences structure if needed
            const preferences = localStorage.getItem('userPreferences');
            if (preferences) {
                const parsed = JSON.parse(preferences);
                // Add any new preference fields with defaults
                if (!parsed.hasOwnProperty('newPreferenceField')) {
                    parsed.newPreferenceField = 'defaultValue';
                    localStorage.setItem('userPreferences', JSON.stringify(parsed));
                }
            }
        }
    };

    // Execute all upgrade tasks
    Object.values(upgradeTasks).forEach(task => task());
}

// Export functions for testing and external use
// export { createInPageButton, validateLandmarkStructure, handleUpgrade, initializeDefaultSettings, performUpgradeTasks };

// Auto-run upgrade check on page load (if in browser context)
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        handleUpgrade();
    });
}