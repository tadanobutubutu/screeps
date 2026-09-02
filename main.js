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

// Function to handle upgrade logic
function performUpgrade() {
    const storedVersion = localStorage.getItem('appVersion') || '0.0.0';
    const currentVersion = '1.0.0';

    if (compareVersions(storedVersion, currentVersion) >= 0) {
        return { upgraded: false, message: 'Application is up to date' };
    }

    try {
        // Migrate user settings to new format if needed
        migrateUserSettings(storedVersion);

        // Clear deprecated cache entries
        clearDeprecatedCache();

        // Update stored version
        localStorage.setItem('appVersion', currentVersion);

        return {
            upgraded: true,
            fromVersion: storedVersion,
            toVersion: currentVersion,
            message: `Successfully upgraded from ${storedVersion} to ${currentVersion}`
        };
    } catch (error) {
        console.error(`Upgrade failed: ${error.message}`);
        return { upgraded: false, message: `Upgrade failed: ${error.message}` };
    }
}

// Helper function to compare semantic versions
function compareVersions(v1, v2) {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
        const p1 = parts1[i] || 0;
        const p2 = parts2[i] || 0;

        if (p1 < p2) return -1;
        if (p1 > p2) return 1;
    }

    return 0;
}

// Helper function to migrate user settings
function migrateUserSettings(fromVersion) {
    const legacySettings = localStorage.getItem('userPreferences');

    if (legacySettings) {
        try {
            const settings = JSON.parse(legacySettings);
            // Transform legacy settings to new format
            const newSettings = {
                theme: settings.theme || 'light',
                language: settings.lang || 'en',
                notifications: settings.notify !== false
            };
            localStorage.setItem('settings', JSON.stringify(newSettings));
            localStorage.removeItem('userPreferences');
        } catch (error) {
            console.warn('Settings migration skipped due to parse error');
        }
    }
}

// Helper function to clear deprecated cache
function clearDeprecatedCache() {
    const deprecatedKeys = ['oldCache', 'tempData', 'legacyState'];
    deprecatedKeys.forEach(key => {
        if (localStorage.getItem(key)) {
            localStorage.removeItem(key);
        }
    });
}

// Check for upgrades on initialization
function initUpgradeCheck() {
    const result = performUpgrade();
    if (result.upgraded) {
        console.log(result.message);
    }
    return result;
}

// Preserve any existing exports here
// export { existingFunction1, existingFunction2, ... };
// export { createInPageButton, validateLandmarkStructure, performUpgrade, compareVersions, initUpgradeCheck };