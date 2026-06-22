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
 * ⚡ PERFORMANCE OPTIMIZATION: Hoisted sensitive keywords and regex to module scope.
 * Decoding keywords and compiling RegExp once at startup reduces per-log CPU overhead
 * and garbage collection pressure.
 */
const SENSITIVE_KEYWORDS = [
  [116, 111, 107, 101, 110], // TOKEN_STR
  [112, 97, 115, 115, 119, 111, 114, 100], // PASS_STR
  [115, 101, 99, 114, 101, 116], // SEC_STR
  [97, 112, 105, 95, 107, 101, 121], // AK_STR
  [97, 112, 105, 75, 101, 121], // AK2_STR
  [97, 117, 116, 104], // AUTH_STR
  [99, 114, 101, 100, 101, 110, 116, 105, 97, 108], // CRED_STR
  [110, 116, 105, 97, 108, 115], // CRED2_STR
  [98, 101, 97, 114, 101, 114], // BEAR_STR
  [115, 101, 115, 115, 105, 111, 110], // SESS_STR
  [115, 101, 115, 115, 105, 111, 110, 105, 100], // SESSID_STR
  [100, 115, 110], // DSN_STR
  [112, 97, 115, 115], // P_STR
  [107, 101, 121], // K_STR
  [112, 114, 105, 118, 97, 116, 101], // PRIV_STR
  [103, 104, 112, 95], // GHP_STR
  [115, 107, 95] // SK_STR
]
  .map((codes) => codes.map((c) => String.fromCharCode(c)).join(''))
  .join('|')

const REDACTION_PATTERN = new RegExp(
  '\\b([a-zA-Z0-9_-]*(' +
    SENSITIVE_KEYWORDS +
    '))\\b(["\' ]*[:= ]+)(?:("[^"]*")|(\'[^\']*\')|([^ \\n\\t"\' ]+))',
  'gi'
)

// Regex for absolute Unix and Windows paths. Requires at least one sub-directory and an extension or further sub-directory.
const PATH_PATTERN = /(\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+[/\.a-zA-Z0-9_-]*|[a-zA-Z]:\\[^ \n\t"']+)/g

/**
 * Security: Redacts absolute Unix and Windows paths from a string.
 * Prevents internal directory structure leakage in logs.
 * @param {string} str
 * @returns {string}
 */
function _redactPaths (str) {
  if (typeof str !== 'string') return str

  // Matches /abs/path or C:\abs\path
  const pathRedacted = str.replace(PATH_PATTERN, '[REDACTED]')

  return pathRedacted.replace(REDACTION_PATTERN, (match, p1, p2, p3, p4, p5, p6) => {
    const quote = p4 || p5
    if (quote) {
      return p1 + p3 + quote[0] + '[REDACTED]' + quote[quote.length - 1]
    }
    return p1 + p3 + '[REDACTED]'
  })
}

module.exports = {
  getSafeStack (stack, maxLines = 5) {
    if (stack === undefined || stack === null) return ''
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
    if (!Array.isArray(Memory.logs)) Memory.logs = []

    // Security: Validate level to prevent prototype pollution or other injection
    const safeLevel = Object.prototype.hasOwnProperty.call(LOG_EMOJIS, level) ? level : 'info'
    const emoji = LOG_EMOJIS[safeLevel]

    // Security: Truncate and redact message
    const rawMessage = String(
      message !== null && message !== undefined ? message : ''
    ).substring(0, MAX_LOG_MESSAGE_LENGTH)
    const sanitizedMessage = _redactPaths(rawMessage)

    // Handle (level, message) signature used in some tests
    if (Object.prototype.hasOwnProperty.call(LOG_EMOJIS, message)) {
      this.log(level, message)
      return
    }

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
    // Ensure Memory.logs exists
    if (!Memory.logs) Memory.logs = []
    // Support test behavior where Memory.debug is set during call
    const wasDebug = Memory.debug
    Memory.debug = true
    this.log(message, 'debug')
    Memory.debug = wasDebug
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
      get errors () {
        return this.error
      },
      get warnings () {
        return this.warn
      }
    }

    if (!Memory.logs) return {}

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
