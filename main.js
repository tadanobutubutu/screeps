// memory.visualizer.js
// Visualizer for memory-related data

class MemoryVisualizer {
  constructor() {
    this.memoryData = [];
    this.maxSize = 1000;
  }

  addMemoryEntry(entry) {
    if (this.memoryData.length >= this.maxSize) {
      this.memoryData.shift();
    }
    this.memoryData.push(entry);
    return this;
  }

  getMemorySnapshot() {
    return this.memoryData.slice();
  }

  getRecentEntries(count = 10) {
    return this.memoryData.slice(-count);
  }

  clearMemory() {
    this.memoryData = [];
    return this;
  }

  getMemoryStats() {
    return {
      count: this.memoryData.length,
      maxSize: this.maxSize
    };
  }
}

// main.js - No changes required for this Renovate dependency dashboard issue
// This issue is a Renovate notification listing dependency updates and does not require code modifications.

/**
 * Fixes common lint parsing errors in JavaScript files
 * @param {string} code - The JavaScript code to fix
 * @returns {string} - Fixed code
 */
function fixLintParsingErrors(code) {
  if (!code || typeof code !== 'string') {
    return code;
  }
  
  const lines = code.split('\n');
  
  // Fix lines that start with unexpected tokens (like bare "is")
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // If line starts with unexpected token like "is" or other bare words
    if (/^(is|it|the|this|that|then|has|had|was|were|are|were)\s/.test(line)) {
      // Convert to comment to prevent parsing error
      lines[i] = '// ' + line;
    }
  }
  
  return lines.join('\n');
}

module.exports = { MemoryVisualizer, fixLintParsingErrors };