// utils.logging.js

const { LOG_LEVEL } = require('./src/constants');

const LOG_EMOJIS = {
    debug: '\ud83d\udc1b',
    info: '\ud83d\udcd8',
    warn: '\u26a0\ufe0f',
    error: '\u274c',
    critical: '\ud83d\udea8',
};

function getSafeStack(stack) {
    if (typeof stack !== 'string') return '';
    return stack.substring(0, 2000);
}

const logger = {
    log: function (level, message, meta) {
        if (!Array.isArray(global.Memory.logs)) {
            global.Memory.logs = [];
        }

        const emoji = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level)
            ? LOG_EMOJIS[level]
            : '\ud83d\udcac';

        const logEntry = `${emoji} [${level}] ${message}`;
        console.log(logEntry);
        global.Memory.logs.push({
            tick: global.Game ? global.Game.time : 0,
            level: level,
            message: message,
            meta: meta,
        });
    },

    info: function (message, meta) {
        this.log('info', message, meta);
    },

    warn: function (message, meta) {
        this.log('warn', message, meta);
    },

    error: function (message, meta) {
        this.log('error', message, meta);
    },

    getSafeStack: getSafeStack,

    getStats: function () {
        if (!Array.isArray(global.Memory.logs)) return { total: 0, errors: 0, info: 0 };
        return global.Memory.logs.reduce(
            (acc, log) => {
                acc.total++;
                if (log && log.level === 'error') acc.errors++;
                if (log && log.level === 'info') acc.info++;
                return acc;
            },
            { total: 0, errors: 0, info: 0 }
        );
    },
};

module.exports = logger;
