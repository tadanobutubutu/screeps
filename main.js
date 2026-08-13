// utils.emotions.js
// ... (previous code remains unchanged)

/**
 * Processes emotion data to ensure consistent formatting
 * @param {string} emotion - The emotion string to process
 * @returns {string} - The processed emotion string
 */
function processEmotion(emotion) {
  if (!emotion) return '';

  // Ensure the emotion is properly formatted
  return emotion.trim()
    .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special characters
    .toLowerCase();
}

// ... (rest of the file remains unchanged)