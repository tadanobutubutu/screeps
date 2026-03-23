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

// ============================================================
// 公開API
// ============================================================

/**
 * ログレベルを設定する
 * @param {number} level - LOG_LEVEL 定数のいずれか
 */
function setLevel(level) {
    _level = level;
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
    const full = data !== undefined
        ? `${message} ${JSON.stringify(data)}`
        : message;
    _record('debug', full);
    console.log(_colorize(`${_prefix('debug')} ${full}`, COLORS.debug));
}

/**
 * INFOレベルのログを出力する
 * @param {string} message
 * @param {*} [data]
 */
function info(message, data) {
    if (_level > LOG_LEVEL.INFO) return;
    _stats.info++;
    const full = data !== undefined
        ? `${message} ${JSON.stringify(data)}`
        : message;
    _record('info', full);
    console.log(_colorize(`${_prefix('info')} ${full}`, COLORS.info));
}

/**
 * WARNレベルのログを出力する
 * @param {string} message
 * @param {*} [data]
 */
function warn(message, data) {
    if (_level > LOG_LEVEL.WARN) return;
    _stats.warn++;
    const full = data !== undefined
        ? `${message} ${JSON.stringify(data)}`
        : message;
    _record('warn', full);
    console.log(_colorize(`${_prefix('warn')} ${full}`, COLORS.warn));
}

/**
 * ERRORレベルのログを出力する
 * @param {string} message
 * @param {Error|*} [error] - エラーオブジェクトまたは付加情報
 */
function error(message, error) {
    if (_level > LOG_LEVEL.ERROR) return;
    _stats.error++;
    let full = message;
    if (error instanceof Error) {
        full += ` | ${error.message}`;
        if (error.stack) {
            full += `\n${getSafeStack(error.stack)}`;
        }
    } else if (error !== undefined) {
        full += ` ${JSON.stringify(error)}`;
    }
    _record('error', full);
    console.log(_colorize(`${_prefix('error')} ${full}`, COLORS.error));
}

/**
 * 成功ログ（INFOレベル）を緑色で出力する
 * @param {string} message
 */
function success(message) {
    if (_level > LOG_LEVEL.INFO) return;
    _stats.info++;
    _record('info', message);
    console.log(_colorize(`${_prefix('info')} ✓ ${message}`, COLORS.success));
}

/**
 * スタックトレースから安全な部分を抽出する（長すぎる場合に切り詰め）
 * @param {string} stack
 * @param {number} [maxLines=5]
 * @returns {string}
 */
function getSafeStack(stack) {
    if (!stack) return '';
    const lines = stack.split('\n');
    return lines.slice(0, 5).join('\n');
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
        _level = Memory.logLevel;
    }
}

/**
 * ログ設定ダッシュボードをコンソールに表示する
 */
function showDashboard() {
    const stats = getStats();
    console.log(_colorize('=== Logger Dashboard ===', COLORS.highlight));
    console.log(`Level: ${_level} (0=DEBUG, 1=INFO, 2=WARN, 3=ERROR, 4=NONE)`);
    console.log(`Stats: DEBUG=${stats.debug} INFO=${stats.info} WARN=${stats.warn} ERROR=${stats.error}`);
    console.log('Recent logs:');
    const recent = getHistory(5);
    for (const entry of recent) {
        const color = COLORS[entry.level] || COLORS.info;
        console.log(_colorize(`  [T:${entry.tick}][${entry.level}] ${entry.message}`, color));
    }
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
};
