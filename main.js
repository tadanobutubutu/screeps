// utils.emotions.js
// ... (previous code remains unchanged until line 389)

function getEmotionDescription(emotion) {
  // Example fix for unterminated string - ensure all strings are properly terminated
  const descriptions = {
    happy: "Feeling joyful and content",
    sad: "Feeling down or unhappy",
    angry: "Feeling frustrated or irritated",
    surprised: "Feeling shocked or amazed",
    // Ensure all strings are properly closed with matching quotes
  };

  return descriptions[emotion] || "Unknown emotion";
}

// ... (rest of the file remains unchanged)