// utils.emotions.js
// (This is a template - please replace with your actual file content)

/**
 * Emotion utility functions
 */

// ... existing code ...

// Example of how to fix an unterminated string (this is just an example)
function getEmotionDescription(emotion) {
  const descriptions = {
    happy: "Feeling joyful and content",
    sad: "Feeling down or unhappy",
    angry: "Feeling frustrated or irritated",
    // Fixed unterminated string example:
    surprised: "Feeling shocked or amazed"  // Ensure all strings are properly terminated
  };

  return descriptions[emotion] || "Unknown emotion";
}

// ... rest of existing code ...

// Make sure all string literals in the file are properly terminated
// For example, if you had something like:
// const message = "This is an unterminated string;
// It should be:
// const message = "This is a properly terminated string";