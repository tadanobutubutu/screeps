// utils.emotions.js
// ... (all existing code before line 389)

/**
 * Processes emotion data with proper string termination
 * @param {string} emotion - The emotion to process
 * @returns {string} Processed emotion string
 */
function processEmotion(emotion) {
  // Ensure the string is properly terminated
  const processed = emotion.replace(/[^a-zA-Z0-9\s]/g, '');
  return `"${processed}"`; // Properly terminate the string
}

// ... (rest of the existing code)