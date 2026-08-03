// memory.visualizer.js
const fs = require('fs')

class MemoryVisualizer {
  constructor (options = {}) {
    this.maxMemory = options.maxMemory || 1000
    this.data = []
    this.thresholds = options.thresholds || {
      warning: 0.7,
      critical: 0.9
    }
  }

  add (data) {
    this.data.push(data)
    return this
  }

  clear () {
    this.data = []
    return this
  }

  visualize () {
    const memory = process.memoryUsage()
    return {
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      rss: memory.rss
    }
  }

  getStats () {
    const memory = this.visualize()
    const usagePercent = (memory.heapUsed / memory.heapTotal) * 100

    return {
      usagePercent,
      status:
                usagePercent >= this.thresholds.critical * 100
                  ? 'critical'
                  : usagePercent >= this.thresholds.warning * 100
                    ? 'warning'
                    : 'normal',
      dataPoints: this.data.length
    }
  }

  exportToFile (filepath) {
    const content = JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        memory: this.visualize(),
        stats: this.getStats(),
        data: this.data
      },
      null,
      2
    )

    fs.writeFileSync(filepath, content, 'utf8')
    return filepath
  }

  loadFromFile (filepath) {
    const content = fs.readFileSync(filepath, 'utf8')
    const parsed = JSON.parse(content)
    this.data = parsed.data || []
    return this
  }
}

module.exports = MemoryVisualizer
