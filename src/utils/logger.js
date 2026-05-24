/**
 * src/utils/logger.js
 * Screeps ログ出力ユーティリティ
 *
 * ログレベル別の出力制御・統計収集・スタック安全化を提供する。
 * グローバルキャッシュは global.cache.logs に格納する。
 */

'use strict';

const { LOG_LEVEL, DEFAULT_LOG_LEVEL } = require('../constants');

// ============================================================
// 内部状態
// ============================================================

let _level = DEFAULT_LOG_LEVEL;
const _stats = {
    debug: 0,
    info: 0,
    warn: 0,
    error: 0,
};
const _history = [];
const MAX_HISTORY = 50;

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded strings can crash the AI.
 * セキュリティ：メモリ消費によるDoS攻撃を防ぐための制限。
 * Screepsのメモリは2MBに制限されているため、無制限の文字列はAIをクラッシュさせる可能性があります。
 */
const MAX_LOG_MESSAGE_LENGTH = 500;
const MAX_STACK_TRACE_LENGTH = 2000;

// ============================================================
// カラーコード（Screeps コンソール用 HTML）
// ============================================================

const COLORS = {
    debug: '#888888',
    info: '#00bfff',
    warn: '#ffaa00',
    error: '#ff4444',
    success: '#00ff88',
    highlight: '#ffffff',
};

// ============================================================
// 内部ヘルパー
// ============================================================

/**
 * 現在のティックと現在時刻を含むプレフィックスを生成する
 * @param {string} level - ログレベル文字列
 * @returns {string}
 */
function _prefix(level) {
    return `[T:${Game.time}][${level.toUpperCase()}]`;
}

/**
 * HTML カラータグで文字列をラップする
 * @param {string} text
 * @param {string} color - 16進数カラーコード (#rrggbb)
 * @returns {string}
 */
function _colorize(text, color) {
    return `<font color="${color}">${text}</font>`;
}

/**
 * ログエントリを履歴に追加する
 * @param {string} level
 * @param {string} message
 */
function _record(level, message) {
    _history.push({ tick: Game.time, level, message });
    if (_history.length > MAX_HISTORY) {
        _history.shift();
    }
}

/**
 * Security: Escapes HTML special characters to prevent console injection.
 * ⚡ PERFORMANCE: Hoisted the escape character map and added a fast-path regex check
 * to avoid unnecessary .replace() calls on safe strings.
 * @param {string} str
 * @returns {string}
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

function _createCircularReplacer() {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === 'object' && value !== null) {
            if (seen.has(value)) return '[Circular]';
            seen.add(value);
        }
        return value;
    };
}

/**
 * Security: Safely stringifies an object, handling circular references and limiting length.
 * Prevents Denial of Service (DoS) mid-tick from JSON.stringify failures.
 * @param {*} obj
 * @param {number} [maxLength=500]
 * @returns {string}
 */
function _safeStringify(obj, maxLength = 500) {
    try {
        const str = JSON.stringify(obj, _createCircularReplacer());
        // Security: JSON.stringify returns undefined for functions or undefined,
        // so we must handle it to avoid "Cannot read properties of undefined (reading 'substring')"
        // セキュリティ：JSON.stringifyは関数やundefinedに対してundefinedを返すため、
        // .substring()の呼び出しでエラーが発生しないよう制御する必要があります。
        if (str === undefined) {
            return 'undefined';
        }
        return str.substring(0, maxLength);
    } catch (e) {
        return '[Unstringifiable Object]';
    }
}

// ============================================================
// 公開API
// ============================================================

/**
 * ログレベルを設定する
 * @param {number} level - LOG_LEVEL 定数のいずれか
 */
function setLevel(level) {
    // Security: Validate level to prevent bypassing checks with invalid types (e.g., undefined)
    // セキュリティ：無効な型（undefinedなど）によってチェックがバイパスされるのを防ぐため、レベルを検証します。
    const numericLevel = Number(level);
    const validLevels = Object.values(LOG_LEVEL);
    if (Number.isInteger(numericLevel) && validLevels.includes(numericLevel)) {
        _level = numericLevel;
    } else {
        // Fallback to INFO on invalid input
        _level = LOG_LEVEL.INFO;
    }
}

/**
 * 現在のログレベルを取得する
 * @returns {number}
 */
function getLevel() {
    return _level;
}

/**
 * DEBUGレベルのログを出力する
 * @param {string} message
 * @param {*} [data] - 付加情報（JSON文字列化される）
 */
function debug(message, data) {
    if (_level > LOG_LEVEL.DEBUG) return;
    _stats.debug++;

    // Security: Truncate message to avoid Memory DoS
    // セキュリティ：メモリDoSを避けるためにメッセージを切り詰める
    const sanitizedMessage = String(
        message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH);

    const full =
        data !== undefined ? `${sanitizedMessage} ${_safeStringify(data)}` : sanitizedMessage;
    _record('debug', full);
    const escapedFull = _escapeHTML(full);
    console.log(_colorize(`${_prefix('debug')} ${escapedFull}`, COLORS.debug));
}

/**
 * INFOレベルのログを出力する
 * @param {string} message
 * @param {*} [data]
 */
function info(message, data) {
    if (_level > LOG_LEVEL.INFO) return;
    _stats.info++;

    // Security: Truncate message to avoid Memory DoS
    // セキュリティ：メモリDoSを避けるためにメッセージを切り詰める
    const sanitizedMessage = String(
        message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH);

    const full =
        data !== undefined ? `${sanitizedMessage} ${_safeStringify(data)}` : sanitizedMessage;
    _record('info', full);
    const escapedFull = _escapeHTML(full);
    console.log(_colorize(`${_prefix('info')} ${escapedFull}`, COLORS.info));
}

/**
 * WARNレベルのログを出力する
 * @param {string} message
 * @param {*} [data]
 */
function warn(message, data) {
    if (_level > LOG_LEVEL.WARN) return;
    _stats.warn++;

    // Security: Truncate message to avoid Memory DoS
    // セキュリティ：メモリDoSを避けるためにメッセージを切り詰める
    const sanitizedMessage = String(
        message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH);

    const full =
        data !== undefined ? `${sanitizedMessage} ${_safeStringify(data)}` : sanitizedMessage;
    _record('warn', full);
    const escapedFull = _escapeHTML(full);
    console.log(_colorize(`${_prefix('warn')} ${escapedFull}`, COLORS.warn));
}

/**
 * ERRORレベルのログを出力する
 * @param {string} message
 * @param {Error|*} [error] - エラーオブジェクトまたは付加情報
 */
function error(message, error) {
    if (_level > LOG_LEVEL.ERROR) return;
    _stats.error++;

    // Security: Truncate message to avoid Memory DoS
    // セキュリティ：メモリDoSを避けるためにメッセージを切り詰める
    const sanitizedMessage = String(
        message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH);

    let full = sanitizedMessage;
    if (error instanceof Error) {
        // Security: Truncate error message to avoid Memory DoS
        const sanitizedErrorMsg = String(
            error.message !== null && error.message !== undefined ? error.message : ''
        ).substring(0, MAX_LOG_MESSAGE_LENGTH);
        full += ` | ${sanitizedErrorMsg}`;
        if (error.stack) {
            full += `\n${getSafeStack(error.stack)}`;
        }
    } else if (error !== undefined) {
        full += ` ${_safeStringify(error)}`;
    }
    _record('error', full);
    const escapedFull = _escapeHTML(full);
    console.log(_colorize(`${_prefix('error')} ${escapedFull}`, COLORS.error));
}

/**
 * 成功ログ（INFOレベル）を緑色で出力する
 * @param {string} message
 */
function success(message) {
    if (_level > LOG_LEVEL.INFO) return;
    _stats.info++;

    // Security: Truncate message to avoid Memory DoS
    // セキュリティ：メモリDoSを避けるためにメッセージを切り詰める
    const sanitizedMessage = String(
        message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH);

    _record('info', sanitizedMessage);
    // Security: Escape message to prevent console injection
    const escapedMessage = _escapeHTML(sanitizedMessage);
    console.log(_colorize(`${_prefix('info')} ✓ ${escapedMessage}`, COLORS.success));
}

/**
 * スタックトレースから安全な部分を抽出する（長すぎる場合に切り詰め、絶対パスを削除）
 * @param {string} stack
 * @param {number} [maxLines=5] - 返す最大行数
 * @returns {string}
 *
 * Security: Absolute paths are removed to prevent internal directory structure leakage.
 */
function getSafeStack(stack, maxLines) {
    if (!stack) return '';

    // Security: 巨大なスタックトレースによるメモリ消費やDoSを防ぐため、入力を2000文字に制限
    const truncatedStack = String(stack).substring(0, MAX_STACK_TRACE_LENGTH);

    const lines = truncatedStack.split('\n');
    return lines
        .slice(0, maxLines || 5)
        .map((line) => {
            // Match "filename:line:col" at the end of a path segment.
            // Uses a simple non-backtracking pattern to avoid ReDoS.
            const match = line.match(/[^/\\]+:\d+:\d+/);
            if (match) {
                return `    at ${match[0]}`;
            }
            // Security: If the line looks like a stack trace entry but doesn't match
            // the safe pattern, redact it to prevent internal path leakage.
            if (line.trim().startsWith('at ')) {
                return '    at [REDACTED]';
            }
            return line;
        })
        .join('\n');
}

/**
 * 関数をtry-catchでラップして実行し、エラー時にログを出力する
 * @param {Function} fn - 実行する関数
 * @param {string} context - エラーメッセージに含めるコンテキスト名
 * @param {...*} args - 関数に渡す引数
 * @returns {*} 関数の戻り値、エラー時は undefined
 */
function tryCatch(fn, context, ...args) {
    try {
        return fn(...args);
    } catch (e) {
        error(`[${context}] ${e.message}`, e);
        return undefined;
    }
}

/**
 * ログ統計を返す
 * @returns {{ debug: number, info: number, warn: number, error: number, total: number }}
 */
function getStats() {
    return {
        ..._stats,
        total: _stats.debug + _stats.info + _stats.warn + _stats.error,
    };
}

/**
 * ログ履歴を返す
 * @param {number} [count=10] - 取得する件数
 * @returns {Array<{ tick: number, level: string, message: string }>}
 */
function getHistory(count) {
    const n = count || 10;
    return _history.slice(-n);
}

/**
 * 統計をリセットする
 */
function resetStats() {
    _stats.debug = 0;
    _stats.info = 0;
    _stats.warn = 0;
    _stats.error = 0;
    _history.length = 0;
}

/**
 * ロガーを初期化する（各ティックの先頭で呼び出す）
 * Memory.logLevel が設定されていればそれを使用する
 */
function init() {
    if (Memory.logLevel !== undefined && Memory.logLevel !== _level) {
        // Security: Use setLevel for validation instead of direct assignment to prevent level bypasses
        // セキュリティ: レベルのバイパスを防ぐため、直接代入せず検証ロジックを含むsetLevelを使用します
        setLevel(Memory.logLevel);
    }
}

/**
 * ログ設定ダッシュボードをコンソールに表示する
 */
function showDashboard() {
    const stats = getStats();
    console.log(_colorize('=== Logger Dashboard ===', COLORS.highlight));
    console.log(`Level: ${_level} (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR, 4=NONE)`);
    console.log(
        `Stats: DEBUG=${stats.debug} INFO=${stats.info} WARN=${stats.warn} ERROR=${stats.error}`
    );
    console.log('Recent logs:');
    const recent = getHistory(5);
    for (const entry of recent) {
        const color = COLORS[entry.level] || COLORS.info;
        // Security: Escape both level and message to prevent console injection when showing history
        const escapedLevel = _escapeHTML(entry.level);
        const escapedMessage = _escapeHTML(entry.message);
        console.log(_colorize(`  [T:${entry.tick}][${escapedLevel}] ${escapedMessage}`, color));
    }
}

/**
 * ログ履歴をクリアする
 */
function clear() {
    _history.length = 0;
    _stats.debug = 0;
    _stats.info = 0;
    _stats.warn = 0;
    _stats.error = 0;
}

module.exports = {
    LOG_LEVEL,
    setLevel,
    getLevel,
    debug,
    info,
    warn,
    error,
    success,
    getSafeStack,
    tryCatch,
    getStats,
    getHistory,
    resetStats,
    init,
    showDashboard,
    clear,
};
