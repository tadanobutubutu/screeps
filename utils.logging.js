// Logging System for Error Detection
// Logs are stored in Memory.logs and collected by GitHub Actions

module.exports = {
  // Initialize logging system
  init: function() {
    if (!Memory.logs) {
      Memory.logs = [];
    }
    
    // Clean old logs (keep last 100)
    if (Memory.logs.length > 100) {
      Memory.logs = Memory.logs.slice(-100);
    }
  },
  
  // Log a message
  log: function(level, message) {
    if (!Memory.logs) {
      Memory.logs = [];
    }
    
    Memory.logs.push({
      time: Game.time,
      level: level,
      message: String(message)
    });
    
    // Also output to console with emoji
    const emoji = {
      'error': '❌',
      'warn': '⚠️',
      'info': 'ℹ️',
      'debug': '🔍'
    };
    
    console.log(`${emoji[level] || '💬'} [${level}] ${message}`);
  },
  
  // Convenience methods
  error: function(message) {
    this.log('error', message);
  },
  
  warn: function(message) {
    this.log('warn', message);
  },
  
  info: function(message) {
    this.log('info', message);
  },
  
  debug: function(message) {
    this.log('debug', message);
  },
  
  // Wrap function with error catching
  tryCatch: function(fn, context) {
    try {
      return fn();
    } catch(e) {
      this.error(`Exception in ${context}: ${e.message}\n${e.stack}`);
      return null;
    }
  },
  
  // Get recent logs
  getRecentLogs: function(count = 10) {
    if (!Memory.logs) return [];
    return Memory.logs.slice(-count);
  },
  
  // Get errors only
  getErrors: function(count = 10) {
    if (!Memory.logs) return [];
    return Memory.logs
      .filter(log => log.level === 'error')
      .slice(-count);
  },
  
  // Clear all logs
  clear: function() {
    Memory.logs = [];
    console.log('🗑️ Logs cleared');
  },
  
  // Get statistics
  getStats: function() {
    if (!Memory.logs) return {};
    
    const stats = {
      total: Memory.logs.length,
      errors: 0,
      warnings: 0,
      info: 0,
      debug: 0
    };
    
    Memory.logs.forEach(log => {
      if (log.level === 'error') stats.errors++;
      else if (log.level === 'warn') stats.warnings++;
      else if (log.level === 'info') stats.info++;
      else if (log.level === 'debug') stats.debug++;
    });
    
    return stats;
  }
};
