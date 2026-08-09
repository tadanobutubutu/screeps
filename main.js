// utils.emotions.js
// ... existing code ...

// Example fix for unterminated string (adjust based on actual code)
function processEmotions(emotionString) {
  // Ensure all strings are properly terminated
  const sanitizedString = emotionString.replace(/([^\\])"/g, '$1\\"');

  // ... rest of the function ...
}

// ... rest of existing code ...