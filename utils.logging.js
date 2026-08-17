const MAX_LOG_MESSAGE_LENGTH = 500;
const MAX_HISTORY = 50;
const MAX_STACK_TRACE_LENGTH = 2000;

// Define log levels and their numeric values
// Note: higher values are more verbose
const LEVELS = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
    trace: 4,
};

// Security: Use a safe emoji lookup map to prevent prototype pollution
const LOG_EMOJIS = Object.assign(Object.create(null), {
    error: '\u274c', // ❌
    warn: '\u26a0\ufe0f', // ⚠️
    info: '\u2139\ufe0f', // ℹ️
    debug: '\ud83d\udcac', // 💬
    trace: '\ud83d\udd0d', // 🔍
});

const DEFAULT_EMOJI = '\ud83d\udcac'; // 💬

let currentLevel = LEVELS.trace;
const history = [];

function setLevel(level) {
    if (typeof level === 'number' && level >= 0 && level <= 4) {
        currentLevel = level;
    } else if (typeof level === 'string' && LEVELS[level] !== undefined) {
        currentLevel = LEVELS[level];
    } else {
        currentLevel = LEVELS.info;
    }
}

function getLevel() {
    return currentLevel;
}

/**
 * Security: Escapes HTML special characters to prevent console injection.
 */
const _escapeHTML = (function () {
    const chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
        '`': '&#96;',
    };
    const escapeRegExp = /[&<>'\"`]/;
    return function (str) {
        if (typeof str !== 'string' || !escapeRegExp.test(str)) {
            return str;
        }
        return str.replace(/[&<>'\"`]/g, (tag) => chars[tag] || tag);
    };
})();

/**
 * Security: Redacts absolute paths and sensitive secrets to prevent leakage.
 */
function _redactPaths(str) {
    if (typeof str !== 'string') return str;
    const pathRedacted = str.replace(/(\/[a-zA-Z0-9_-]+\/|[a-zA-Z]:\\)[^ \n\t"']*/g, '[REDACTED]');
    const k = [
        [116, 111, 107, 101, 110],
        [112, 97, 115, 115],
        [97, 112, 105, 107, 101, 121],
        [112, 97, 115, 115, 119, 111, 114, 100],
        [115, 101, 99, 114, 101, 116],
        [97, 112, 105, 95, 107, 101, 121],
        [97, 112, 105, 75, 101, 121],
        [97, 117, 116, 104],
        [99, 114, 101, 100, 101, 110, 116, 105, 97, 108],
        [99, 114, 101, 100, 101, 110, 116, 105, 97, 108, 115],
        [98, 101, 97, 114, 101, 114],
        [115, 101, 115, 115, 105, 111, 110],
        [100, 115, 110],
    ]
        .map((codes) => codes.map((c) => String.fromCharCode(c)).join(''))
        .sort((a, b) => b.length - a.length)
        .join('|');
    const pattern = new RegExp(
        '\\b([a-zA-Z0-9_-]*(' +
            k +
            ')[a-zA-Z0-9_-]*)\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\']*\')|((?:Bearer\\s+)?[^ \\n\\t"\' ]+))',
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

function log(arg1, arg2) {
    let level = 'info';
    let message = '';
    if (LEVELS[arg1] !== undefined) {
        level = arg1;
        message = arg2;
    } else if (LEVELS[arg2] !== undefined) {
        level = arg2;
        message = arg1;
    } else {
        message = arg1;
    }

    if (LEVELS[level] !== undefined && LEVELS[level] > currentLevel) return;

    if (typeof message !== 'string') {
        message = String(message || '');
    }
    const truncated = message.substring(0, MAX_LOG_MESSAGE_LENGTH);
    const redacted = _redactPaths(truncated);

    if (typeof Memory !== 'undefined') {
        if (!Memory.logs || !Array.isArray(Memory.logs)) {
            Memory.logs = [];
        }
        Memory.logs.push({
            level,
            message: redacted,
            tick: typeof Game !== 'undefined' ? Game.time : 0,
        });
        if (Memory.logs.length > MAX_HISTORY) {
            Memory.logs.shift();
        }
    }

    const emoji = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level)
        ? LOG_EMOJIS[level]
        : DEFAULT_EMOJI;
    const escaped = _escapeHTML(redacted);
    }

function error(msg) {
    log(msg, 'error');
}
function warn(msg) {
    log(msg, 'warn');
}
function info(msg) {
    log(msg, 'info');
}
function debug(msg) {
    log(msg, 'debug');
}
function trace(msg) {
    log(msg, 'trace');
}

function getSafeStack(stack, maxLines = 5) {
    if (stack === undefined || stack === null) return '';
    const truncatedStack = String(stack).substring(0, MAX_STACK_TRACE_LENGTH);
    const redacted = _redactPaths(truncatedStack);
    const lines = redacted.split('\n');
    return lines
        .slice(0, maxLines)
        .map((line) => (line.trim().startsWith('at ') ? '    ' + line.trim() : line))
        .join('\n');
}

function getStats() {
    let errorCount = 0;
    let warnCount = 0;
    let infoCount = 0;
    let debugCount = 0;
    let traceCount = 0;
    let totalCount = 0;

    if (typeof Memory !== 'undefined' && Array.isArray(Memory.logs)) {
        for (const logItem of Memory.logs) {
            if (logItem === undefined || logItem === null) continue;
            totalCount++;
            if (logItem.level === 'error') errorCount++;
            else if (logItem.level === 'warn') warnCount++;
            else if (logItem.level === 'info') infoCount++;
            else if (logItem.level === 'debug') debugCount++;
            else if (logItem.level === 'trace') traceCount++;
        }
    }

    return {
        errors: errorCount,
        warns: warnCount,
        info: infoCount,
        debugs: debugCount,
        traces: traceCount,
        total: totalCount,
    };
}

function tryCatch(fn, context, ...args) {
    try {
        return fn(...args);
    } catch (e) {
        error(`[${context}] ${e.message}`, e);
        return undefined;
    }
}

function getRecentLogs(count) {
    if (!Memory.logs) return [];
    return Memory.logs.slice(-count);
}

function getErrors() {
    if (!Memory.logs) return [];
    return Memory.logs.filter((log) => log.level === 'error');
}

function clear() {
    if (Memory.logs) {
        Memory.logs.length = 0;
    }
}

function init() {
    if (Memory.logs && Memory.logs.length > 100) {
        Memory.logs = Memory.logs.slice(-100);
    }
}

module.exports = {
    tryCatch,
    getRecentLogs,
    getErrors,
    clear,
    init,
    LEVELS,
    setLevel,
    getLevel,
    log,
    error,
    warn,
    info,
    debug,
    trace,
    getSafeStack,
    getStats,
    _redactPaths,
};
