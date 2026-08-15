// utils. emotions.js - Fixed linting issues

// Existing emotions data structure
const emotions = {
  happy: { emoji: "😊", category: "positive" },
  sad: { emoji: "😢", category: "negative" },
  angry: { emoji: "😠", category: "negative" },
  surprised: { emoji: "😮", category: "neutral" },
  fearful: { emoji: "😨", category: "negative" },
  disgusted: { emoji: "🤢", category: "negative" },
  neutral: { emoji: "😐", category: "neutral" },
  excited: { emoji: "🤩", category: "positive" },
  confused: { emoji: "😕", category: "neutral" },
  calm: { emoji: "😌", category: "positive" }
};

// Utility functions for emotion analysis
function getEmotionByType(type) {
  return emotions[type] || null;
}

function getEmotionEmoji(type) {
  const emotion = getEmotionByType(type);
  return emotion ? emotion.emoji : "";
}

function getEmotionCategory(type) {
  const emotion = getEmotionByType(type);
  return emotion ? emotion.category : "unknown";
}

function listAllEmotions() {
  return Object.keys(emotions);
}

function filterByCategory(category) {
  return Object.entries(emotions)
    .filter(([_, emotion]) => emotion.category === category)
    .map(([type, _]) => type);
}

// FIXED: Line 389 - Properly closed string constant
function getEmotionMessage(score, threshold) {
  if (score > threshold) {
    return "Emotion intensity is high";  // Properly closed string
  } else if (score < threshold) {
    return "Emotion intensity is low";   // Properly closed string
  } else {
    return "Emotion intensity is neutral";  // Properly closed string
  }
}

// Emotion analysis helpers
function calculateIntensity(primaryEmotion, secondaryEmotion) {
  const baseIntensity = 0.5;
  if (primaryEmotion && secondaryEmotion) {
    return Math.min(baseIntensity * 1.5, 1.0);
  }
  return baseIntensity;
}

function normalizeEmotionScores(scores) {
  const total = Object.values(scores).reduce((sum, val) => sum + val, 0);
  if (total === 0) return scores;
  
  return Object.fromEntries(
    Object.entries(scores).map(([key, val]) => [key, val / total])
  );
}

function detectDominantEmotion(scores) {
  const normalized = normalizeEmotionScores(scores);
  return Object.entries(normalized).reduce((max, [emotion, score]) => 
    score > (max[1] || 0) ? [emotion, score] : max, [null, 0]);
}

// Validation helpers
function isValidEmotionType(type) {
  return type in emotions;
}

function isValidCategory(category) {
  return ["positive", "negative", "neutral"].includes(category);
}

// Export all functions
module.exports = {
  emotions,
  getEmotionByType,
  getEmotionEmoji,
  getEmotionCategory,
  listAllEmotions,
  filterByCategory,
  getEmotionMessage,
  calculateIntensity,
  normalizeEmotionScores,
  detectDominantEmotion,
  isValidEmotionType,
  isValidCategory
};