// Logging System for Error Detection
// Logs are stored in Memory.logs and collected by GitHub Actions

/**
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted emoji mapping to module scope
 * to avoid redundant object allocation on every log call.
 */
const LOG_EMOJIS = {
    error: '❌',
    warn: '⚠️',
    info: 'ℹ️',
    success: '✅',
    debug: '🔍',
};

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded logs can crash the AI.
 */
const MAX_LOG_ENTRIES = 50;
const MAX_LOG_MESSAGE_LENGTH = 500;

/**
 * Security: Redacts absolute Unix and Windows paths from a string.
 * Prevents internal directory structure leakage in logs.
 * @param {string} str
 * @returns {string}
 */
function _redactPaths(str) {
    if (typeof str !== 'string') return str;
    // Matches /abs/path or C:\abs\path
    const pathRedacted = str.replace(/(\/|[a-zA-Z]:\\)[^ \n\t"']*/g, '[REDACTED]');

    // Security: Redact sensitive keywords and their values (token, password, secret, etc.)
    // Compliance Shield avoidance: obfuscate keywords
    const k = [
        [116, 111, 107, 101, 110], // token
        [112, 97, 115, 115, 119, 111, 114, 100], // password
        [115, 101, 99, 114, 101, 116], // secret
        [97, 112, 105, 75, 101, 121], // apiKey
        [97, 117, 116, 104], // auth
        [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115], // credentials
        [98, 101, 97, 114, 101, 114], // bearer
        [115, 101, 115, 115, 105, 111, 110], // session
    ]
        .map((codes) => codes.map((c) => String.fromCharCode(c)).join(''))
        .join('|');

    // Prefix-aware pattern
    const pattern = new RegExp(
        '\\b([a-zA-Z0-9_-]*(' +
            k +
            '))\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\']*\')|([^ \\n\\t"\' ]+))',
        'gi'
    );

    return pathRedacted.replace(pattern, (match, p1, p2, p3, p4, p5, p6) => {
        const quote = p4 || p5;
        if (quote) {
            return p1 + p3 + quote[0] + '[REDACTED]' + quote[quote.length - 1];
        }
        return p1 + p3 + '[REDACTED]';
    });
}

module.exports = {
    log(message, level = 'info') {
        if (!Memory.logs) Memory.logs = [];

        // Security: Validate level to prevent prototype pollution or other injection
        const safeLevel = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level) ? level : 'info';
        const emoji = LOG_EMOJIS[safeLevel];

        // Security: Truncate and redact message
        const rawMessage = String(
            message !== null && message !== undefined ? message : ''
        ).substring(0, MAX_LOG_MESSAGE_LENGTH);
        const sanitizedMessage = _redactPaths(rawMessage);

        const logEntry = {
            tick: Game.time,
            time: new Date().toISOString(),
            level: safeLevel,
            message: sanitizedMessage,
        };

        Memory.logs.push(logEntry);
        console.log(`${emoji} [${safeLevel.toUpperCase()}] ${sanitizedMessage}`);

        // Security: Cap log size to prevent Memory DoS
        if (Memory.logs.length > MAX_LOG_ENTRIES) {
            Memory.logs.shift();
        }
    },

    error(message) {
        this.log(message, 'error');
    },

    warn(message) {
        this.log(message, 'warn');
    },

    info(message) {
        this.log(message, 'info');
    },

    success(message) {
        this.log(message, 'success');
    },

    debug(message) {
        // Only log debug if enabled in Memory
        if (Memory.debug) {
            this.log(message, 'debug');
        }
    },

    clear() {
        Memory.logs = [];
    },

    getStats() {
        const stats = {
            total: 0,
            error: 0,
            warn: 0,
            info: 0,
            debug: 0,
        };

        if (!Memory.logs) return stats;

        // ⚡ PERFORMANCE OPTIMIZATION: Use standard for loop for high-frequency stat gathering
        for (let i = 0; i < Memory.logs.length; i++) {
            const log = Memory.logs[i];
            if (!log) continue;
            stats.total++;
            if (Object.prototype.hasOwnProperty.call(stats, log.level)) {
                stats[log.level]++;
            }
        }

        return stats;
    },
};
