// utils.emotions.js
// ... (previous code remains unchanged until line 389)

function getEmotionDescription(emotion) {
  // Fixed: Ensure all string constants are properly terminated
  const descriptions = {
    happy: "Feeling joyful and content",
    sad: "Feeling sorrow or unhappiness",
    angry: "Feeling strong displeasure or hostility",
    surprised: "Feeling sudden shock or amazement",
    fearful: "Feeling anxious or scared",
    disgusted: "Feeling revulsion or nausea"
  };

  return descriptions[emotion] || "Unknown emotion";
}

// ... (rest of the file remains unchanged)