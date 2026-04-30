// Logging System for Error Detection
// Logs are stored in Memory.logs and collected by GitHub Actions

module.exports = {
  // Initialize logging system
  init: function () {
    if (!Memory.logs) {
      Memory.logs = []
    }

    // Clean old logs (keep last 100)
    if (Memory.logs.length > 100) {
      Memory.logs = Memory.logs.slice(-100)
    }
  },

  /**
     * Security: Escapes HTML special characters to prevent console injection.
     * ⚡ PERFORMANCE: Hoisted the escape character map and added a fast-path regex check
     * to avoid unnecessary .replace() calls on safe strings.
     */
  _escapeHTML: (function () {
    const chars = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
      '`': '&#96;'
    }
    const escapeRegExp = /[&<>'\"`]/

    return function (str) {
      if (typeof str !== 'string' || !escapeRegExp.test(str)) {
        return str
      }
      return str.replace(/[&<>'\"`]/g, (tag) => chars[tag] || tag)
    }
  })(),

  // Log a message
  log: function (level, message) {
    // Security: Memory.logsが改ざんされていた場合に備え、配列であることを確認 (DoS対策)
    if (!Array.isArray(Memory.logs)) {
      Memory.logs = []
    }

    // Security: Truncate level and message to avoid Memory DoS (2MB limit)
    const sanitizedLevel = String(level).substring(0, 20)
    const sanitizedMessage = String(message).substring(0, 500)

    Memory.logs.push({
      time: Game.time,
      level: sanitizedLevel,
      message: sanitizedMessage
    })

    // Security: Immediate rotation to prevent Memory DoS mid-tick
    if (Memory.logs.length > 100) {
      Memory.logs.shift()
    }

    // Also output to console with emoji
    const emojiMap = {
      error: '\u274c',
      warn: '\u26a0\ufe0f',
      info: '\u2139\ufe0f',
      debug: '\ud83d\udd0d'
    }

    // Security: プロトタイプ汚染対策のため、hasOwnProperty.callを使用して安全に絵文字を取得
    const emoji = Object.prototype.hasOwnProperty.call(emojiMap, sanitizedLevel)
      ? emojiMap[sanitizedLevel]
      : '\ud83d\udcac'

    // Security: Escape level and message to prevent HTML injection in the console
    const escapedLevel = this._escapeHTML(sanitizedLevel)
    const escapedMessage = this._escapeHTML(sanitizedMessage)

    console.log(`${emoji} [${escapedLevel}] ${escapedMessage}`)
  },

  // Convenience methods
  error: function (message) {
    this.log('error', message)
  },

  warn: function (message) {
    this.log('warn', message)
  },

  info: function (message) {
    this.log('info', message)
  },

  debug: function (message) {
    this.log('debug', message)
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
    if (!stack) {
      return ''
    }

    // Security: 巨大なスタックトレースによるメモリ消費やDoSを防ぐため、入力を2000文字に制限
    const truncatedStack = String(stack).substring(0, 2000)

    return truncatedStack
      .split('\n')
      .slice(0, 5) // Security: Limit number of lines to prevent DoS
      .map((line) => {
        // Match "filename:line:col" at the end of a path segment.
        // Uses a simple non-backtracking pattern: match the last
        // path component only, without nested quantifiers.
        const match = line.match(/[^/\\]+:\d+:\d+/)
        if (match) {
          return `    at ${match[0]}`
        }
        return line
      })
      .join('\n')
  },

  // Wrap function with error catching
  tryCatch: function (fn, context, ...args) {
    try {
      return fn(...args)
    } catch (e) {
      // Security: Sanitize stack trace before logging to avoid path exposure
      const safeStack = this.getSafeStack(e.stack)
      this.error(`Exception in ${context}: ${e.message}\n${safeStack}`)
      return null
    }
  },

  // Export HTML escape function for other modules
  escapeHTML: function (str) {
    return this._escapeHTML(str)
  },

  // Get recent logs
  getRecentLogs: function (count = 10) {
    if (!Memory.logs) {
      return []
    }
    return Memory.logs.slice(-count)
  },

  // Get errors only
  getErrors: function (count = 10) {
    if (!Memory.logs) {
      return []
    }
    return Memory.logs.filter((log) => log.level === 'error').slice(-count)
  },

  // Clear all logs
  clear: function () {
    Memory.logs = []
    console.log('\ud83d\uddd1\ufe0f Logs cleared')
  },

  // Get statistics
  getStats: function () {
    if (!Memory.logs) {
      return {}
    }

    const stats = {
      total: Memory.logs.length,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0
    }

    Memory.logs.forEach((log) => {
      if (log.level === 'error') {
        stats.errors++
      } else if (log.level === 'warn') {
        stats.warnings++
      } else if (log.level === 'info') {
        stats.info++
      } else if (log.level === 'debug') {
        stats.debug++
      }
    })

    return stats
  }
}
