const emotionStrings = {
    happy: "I'm feeling happy today!",
    sad: "I'm feeling sad today",
    angry: "I'm feeling angry today"
};

const updateDependencies = (dependencies) => {
    const dep1Version = dependencies['@sentry/browser'];
    const dep2Version = dependencies['posthog-js'];

    // If the versions provided in the conflicts are different, use the latest one.
    // This approach ensures that the later changes are incorporated.
    const latestVersions = {
        '@sentry/browser': dep1Version || '10.70.0',
        'posthog-js': dep2Version || '1.416.0',
        'typescript': '^7.0.0',
        'undici': '>=6.24.0'
    };

    return {...dependencies, ...latestVersions};
};

const validateDependencyVersions = (dependencies) => {
    const requiredVersions = { "@sentry/browser": "10.70.0", "posthog-js": "1.416.0", "typescript": "^7.0.0", "undici": ">=6.24.0" };
    for (const [dep, version] of Object.entries(requiredVersions)) {
        if (dependencies[dep] !== version) {
            console.warn(`Dependency ${dep} should be updated to version ${version}`);
        }
    }
};

module.exports = {
    emotionStrings,
    updateDependencies,
    validateDependencyVersions
};