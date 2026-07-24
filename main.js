The resolved file content, with the conflict merged using the HEAD version (console.info), is as follows:

```javascript
const logging = {
  /**
   * Logs an informational message.
   * @param {string} message
   */
  info: console.info,

  /**
   * Logs a formatted message with the given level and optional data.
   * @param {string} level
   * @param {string} message
   * @param {*} [data]
   */
  log(level, message, data) {
    const entry = this.formatLogEntry(level, message);
    if (data !== undefined) {
      console.log(entry, data);
    } else {
      console.log(entry);
    }
  },
  /**
   * Formats a log entry with the specified level and message.
   * @param {string} level
   * @param {string} message
   * @returns {string} The formatted log entry
   */
  formatLogEntry(level, message) {
    const timestamp = new Date().toISOString();
    return `[${level} @ ${timestamp}] ${message}`;
  }
};

// ... rest of the code (without any conflict markers)
```

To summarize the conflict resolution, the Git conflict markers (<<<<<<< HEAD, >>>>>>) indicate where the reserved changes were made in the main.js file during the commit process. There were two versions of the file with different variations. In this case, both versions used different console methods for logging an info message, but they were doing the same thing. Since the rest of the logging object uses level-specific console methods, and the original version (HEAD) was using the most logical one for the info method (console.info), I chose to keep that version. The rest of the codebase remains untouched.