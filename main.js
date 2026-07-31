// utils.emotions.js - Emotion utilities

// Emotion mappings
const EMOTION_MAP = {
  happy: ['joy', 'pleasure', 'satisfaction'],
  sad: ['grief', 'disappointment', 'sorrow'],
  angry: ['frustration', 'irritation', 'rage'],
  fearful: ['anxiety', 'worry', 'concern'],
  surprised: ['amazement', 'astonishment', 'shock'],
  disgusted: ['repulsion', 'revulsion', 'contempt']
};

// Emotion intensity levels
const INTENSITY_LEVELS = {
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  extreme: 1.0
};

/**
 * Detect emotion from text
 * @param {string} text - Input text to analyze
 * @returns {object} Detected emotion and confidence
 */
function detectEmotion(text) {
  if (!text || typeof text !== 'string') {
    return { emotion: 'neutral', confidence: 0 };
  }
  
  const lowerText = text.toLowerCase();
  let maxScore = 0;
  let detectedEmotion = 'neutral';
  
  for (const [emotion, keywords] of Object.entries(EMOTION_MAP)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lowerText.includes(keyword)) {
        score++;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion;
    }
  }
  
  return {
    emotion: detectedEmotion,
    confidence: Math.min(maxScore / 3, 1)
  };
}

/**
 * Get emotion intensity
 * @param {string} intensity - Intensity level name
 * @returns {number} Intensity value
 */
function getEmotionIntensity(intensity) {
  return INTENSITY_LEVELS[intensity] || 0.5;
}

/**
 * Format emotion response
 * @param {object} emotionData - Emotion detection result
 * @returns {string} Formatted emotion string
 */
function formatEmotionResponse(emotionData) {
  const { emotion, confidence } = emotionData;
  const percentage = Math.round(confidence * 100);
  return `Detected emotion: ${emotion} (${percentage}% confidence)`;
}

/**
 * Calculate emotion similarity
 * @param {string} emotion1 - First emotion
 * @param {string} emotion2 - Second emotion
 * @returns {number} Similarity score between 0 and 1
 */
function calculateEmotionSimilarity(emotion1, emotion2) {
  if (emotion1 === emotion2) return 1.0;
  
  const emotions1 = EMOTION_MAP[emotion1] || [];
  const emotions2 = EMOTION_MAP[emotion2] || [];
  
  let sharedCount = 0;
  for (const e1 of emotions1) {
    if (emotions2.includes(e1)) {
      sharedCount++;
    }
  }
  
  const maxLength = Math.max(emotions1.length, emotions2.length);
  return maxLength > 0 ? sharedCount / maxLength : 0;
}

// Export all functions and utilities
module.exports = {
  EMOTION_MAP,
  INTENSITY_LEVELS,
  detectEmotion,
  getEmotionIntensity,
  formatEmotionResponse,
  calculateEmotionSimilarity
};