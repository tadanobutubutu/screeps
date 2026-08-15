// utils.emotions.js
// This file contains emotion-related utility functions

/**
 * Processes emotion data
 * @param {string} emotion - The emotion to process
 * @returns {object} Processed emotion data
 */
function processEmotion(emotion) {
  // Implementation for processing emotions
  return {
    name: emotion,
    intensity: calculateIntensity(emotion)
  };
}

/**
 * Calculates emotion intensity
 * @param {string} emotion - The emotion to calculate intensity for
 * @returns {number} Intensity value (0-100)
 */
function calculateIntensity(emotion) {
  // Implementation for calculating intensity
  const baseIntensity = {
    'happy': 80,
    'sad': 60,
    'angry': 90,
    'fearful': 70,
    'disgusted': 50,
    'surprised': 75
  };

  return baseIntensity[emotion.toLowerCase()] || 50;
}

/**
 * Validates emotion input
 * @param {string} emotion - The emotion to validate
 * @returns {boolean} True if valid, false otherwise
 */
function validateEmotion(emotion) {
  const validEmotions = ['happy', 'sad', 'angry', 'fearful', 'disgusted', 'surprised'];
  return validEmotions.includes(emotion.toLowerCase());
}

// Add any new emotion-related functions here
// For example:
function getEmotionSynonyms(emotion) {
  const synonyms = {
    'happy': ['joyful', 'content', 'pleased'],
    'sad': ['unhappy', 'depressed', 'gloomy'],
    'angry': ['furious', 'irate', 'livid'],
    'fearful': ['scared', 'afraid', 'terrified'],
    'disgusted': ['repulsed', 'nauseated', 'revolted'],
    'surprised': ['shocked', 'amazed', 'astounded']
  };

  return synonyms[emotion.toLowerCase()] || [];
}

// Export all emotion-related functions
module.exports = {
  processEmotion,
  calculateIntensity,
  validateEmotion,
  getEmotionSynonyms
};