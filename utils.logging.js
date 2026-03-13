// Logging System for Error Detection
// Logs are stored in Memory.logs and collected by GitHub Actions

module.exports = {
    // Initialize logging system
    init: function () {
        if (!Memory.logs) {
            Memory.logs = [];
        }

        // Clean old logs (keep last 100)
        if (Memory.logs.length > 100) {
            Memory.logs = Memory.logs.slice(-100);
        }
    },

    // Log a message
    log: function (level, message) {
        if (!Memory.logs) {
            Memory.logs = [];
        }

        Memory.logs.push({
            time: Game.time,
            level: level,
            message: String(message),
        });

        // Also output to console with emoji
        const emoji = {
            error: '\u274c',
            warn: '\u26a0\ufe0f',
            info: '\u2139\ufe0f',
            debug: '\ud83d\udd0d',
        };

        console.log(`${emoji[level] || '\ud83d\udcac'} [${level}] ${message}`);
    },

    // Convenience methods
    error: function (message) {
        this.log('error', message);
    },

    warn: function (message) {
        this.log('warn', message);
    },

    info: function (message) {
        this.log('info', message);
    },

    debug: function (message) {
        this.log('debug', message);
    },

    /**
     * Sanitizes a stack trace to remove internal file paths while keeping
     * function names and line numbers for debugging.
     *
     * Security: Rewritten to avoid ReDoS (super-linear backtracking).
     * Instead of a single complex regex, we use a simple split-based approach
     * that extracts only the filename:line:col portion without catastrophic backtracking.
     */
    getSafeStack: function (stack) {
        if (!stack) return '';

        return stack
            .split('\n')
            .map((line) => {
                // Match "filename:line:col" at the end of a path segment.
                // Uses a simple non-backtracking pattern: match the last
                // path component only, without nested quantifiers.
                const match = line.match(/[^\/\\]+:\d+:\d+/);
                if (match) {
                    return match[0];
                }
                return line;
            })
            .join('\n');
    },

    // Wrap function with error catching
    tryCatch: function (fn, context, ...args) {
        try {
            return fn(...args);
        } catch (e) {
            // Security: Sanitize stack trace before logging to avoid path exposure
            const safeStack = this.getSafeStack(e.stack);
            this.error(`Exception in ${context}: ${e.message}\n${safeStack}`);
            return null;
        }
    },

    // Get recent logs
    getRecentLogs: function (count = 10) {
        if (!Memory.logs) {
            return [];
        }
        return Memory.logs.slice(-count);
    },

    // Get errors only
    getErrors: function (count = 10) {
        if (!Memory.logs) {
            return [];
        }
        return Memory.logs.filter((log) => log.level === 'error').slice(-count);
    },

    // Clear all logs
    clear: function () {
        Memory.logs = [];
        console.log('\ud83d\uddd1\ufe0f Logs cleared');
    },

    // Get statistics
    getStats: function () {
        if (!Memory.logs) {
            return {};
        }

        const stats = {
            total: Memory.logs.length,
            errors: 0,
            warnings: 0,
            info: 0,
            debug: 0,
        };

        Memory.logs.forEach((log) => {
            if (log.level === 'error') {
                stats.errors++;
            } else if (log.level === 'warn') {
                stats.warnings++;
            } else if (log.level === 'info') {
                stats.info++;
            } else if (log.level === 'debug') {
                stats.debug++;
            }
        });

        return stats;
    },
};
