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

// History store
const history = [];

/**
 * Security: Escapes HTML special characters to prevent console injection.
 */
const _escapeHTML = (function () {
    const chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>