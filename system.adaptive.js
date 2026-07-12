// system.adaptive.js

/**
 * ⚡ PERFORMANCE: Hoist default options to module scope.
 */
const DEFAULT_OPTIONS = Object.freeze({
    enabled: true,
    interval: 10,
});

class SystemAdaptive {
    constructor(options = {}) {
        this.options = { ...DEFAULT_OPTIONS, ...options };
    }

    adapt(additionalOptions = {}) {
        this.options = { ...this.options, ...additionalOptions };
    }

    getStatus() {
        return this.options;
    }
}

// Export as CommonJS to match package.json type
module.exports = new SystemAdaptive();
module.exports.SystemAdaptive = SystemAdaptive;
