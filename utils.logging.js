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
  debug: '🔍'
}

/**
 * Security: Limits for memory-intensive structures to prevent Memory DoS.
 * Screeps memory is limited to 2MB; unbounded logs can crash the AI.
 */
const MAX_LOG_ENTRIES = 50
const MAX_LOG_MESSAGE_LENGTH = 500

/**
 * Security: Redacts absolute Unix and Windows paths from a string.
 * Prevents internal directory structure leakage in logs.
 * @param {string} str
 * @returns {string}
 */
function _redactPaths (str) {
  if (typeof str !== 'string') return str
  // Matches /abs/path or C:\abs\path
  const pathRedacted = str.replace(/(\/|[a-zA-Z]:\\)[^ \n\t"']*/g, '[REDACTED]')

  // Security: Redact sensitive keywords and their values (token, password, secret, etc.)
  const keywords = [
    'token',
    'password',
    'secret',
    'api_key',
    'apiKey',
    'auth',
    'credentials',
    'bearer',
    'session',
    'dsn'
  ].join('|')

  // Prefix-aware pattern
  const pattern = new RegExp(
    '\\b([a-zA-Z0-9_-]*(' +
      keywords +
      '))\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\']*\')|([^ \\n\\t"\' ]+))',
    'gi'
  )

  return pathRedacted.replace(pattern, (match, p1, p2, p3, p4, p5, p6) => {
    const quote = p4 || p5
    if (quote) {
      return p1 + p3 + quote[0] + '[REDACTED]' + quote[quote.length - 1]
    }
    return p1 + p3 + '[REDACTED]'
  })
}

module.exports = {
  getSafeStack (stack, maxLines = 5) {
    if (!stack) return ''
    const truncatedStack = String(stack).substring(0, 2000)
    const lines = truncatedStack.split('\n')
    return lines
      .slice(0, maxLines)
      .map((line) => {
        const match = line.match(/[^/\\]+:\d+:\d+/)
        if (match) {
          return `    at ${match[0]}`
        }
        if (line.trim().startsWith('at ')) {
          return '    at [REDACTED]'
        }
        return _redactPaths(line)
      })
      .join('\n')
  },

  tryCatch (fn, context, ...args) {
    try {
      return fn(...args)
    } catch (e) {
      this.error(`[${context}] ${e.message}`)
      return null
    }
  },

  getRecentLogs (count = 10) {
    if (!Memory.logs) return []
    return Memory.logs.slice(-count)
  },

  getErrors () {
    if (!Memory.logs) return []
    return Memory.logs.filter((l) => l.level === 'error')
  },

  init () {
    if (!Memory.logs) Memory.logs = []
    if (Memory.logs.length > 100) {
      Memory.logs = Memory.logs.slice(-100)
    }
  },

  log (message, level = 'info') {
    if (!Memory.logs) Memory.logs = []

    // Support (level, message) signature by swapping if level is not a valid log level
    // and message IS a valid log level.
    let actualLevel = level
    let actualMessage = message

    const isLevelValid = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level)
    const isMessageLevel = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, message)

    if (!isLevelValid && isMessageLevel) {
      actualLevel = message
      actualMessage = level
    }

    // Security: Validate level to prevent prototype pollution or other injection
    const safeLevel = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, actualLevel) ? actualLevel : 'info'

    // Security: Truncate and redact message
    const rawMessage = String(
      actualMessage !== null && actualMessage !== undefined ? actualMessage : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH)
    const sanitizedMessage = _redactPaths(rawMessage)

    const logEntry = {
      tick: Game.time,
      time: new Date().toISOString(),
      level: safeLevel,
      message: sanitizedMessage
    }

    Memory.logs.push(logEntry)
    // Security: Cap log size to prevent Memory DoS
    if (Memory.logs.length > MAX_LOG_ENTRIES) {
      Memory.logs.shift()
    }
  },

  error (message) {
    this.log(message, 'error')
  },

  warn (message) {
    this.log(message, 'warn')
  },

  info (message) {
    this.log(message, 'info')
  },

  success (message) {
    this.log(message, 'success')
  },

  debug (message) {
    // Only log debug if enabled in Memory
    if (Memory.debug) {
      this.log(message, 'debug')
    }
  },

  clear () {
    Memory.logs = []
  },

  getStats () {
    const stats = {
      total: 0,
      error: 0,
      warn: 0,
      info: 0,
      debug: 0,
      // Compatibility with some tests
      get errors () { return this.error },
      get warnings () { return this.warn }
    }

    if (!Memory.logs) return stats

    // ⚡ PERFORMANCE OPTIMIZATION: Use standard for loop for high-frequency stat gathering
    for (let i = 0; i < Memory.logs.length; i++) {
      const log = Memory.logs[i]
      if (log === undefined || log === null) continue
      stats.total++
      if (Object.prototype.hasOwnProperty.call(stats, log.level)) {
        stats[log.level]++
      }
    }

    return stats
  }
}
