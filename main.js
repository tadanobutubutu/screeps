// utils.emotions.js (partial fix example)
function getEmotionDescription(emotion) {
  // Example fix for unterminated string
  const descriptions = {
    happy: "Feeling joyful and content",
    sad: "Feeling down or unhappy",
    angry: "Feeling frustrated or irritated",
    // Ensure all strings are properly terminated
  };

  return descriptions[emotion] || "Unknown emotion";
}

// Other existing functions remain unchanged...