// utils.emotions.js
// ... (previous code remains unchanged)

/**
 * Processes emotion data and returns formatted results
 * @param {Object} emotionData - The emotion data to process
 * @returns {Object} Formatted emotion results
 */
function processEmotionData(emotionData) {
  // Ensure all string constants are properly terminated
  const result = {
    primaryEmotion: emotionData.primary || 'neutral',
    secondaryEmotions: emotionData.secondary || [],
    intensity: emotionData.intensity || 0.5,
    metadata: {
      source: emotionData.source || 'unknown',
      timestamp: emotionData.timestamp || new Date().toISOString()
    }
  };

  // Fixed unterminated string by properly closing the string
  const statusMessage = `Processed emotion data for ${emotionData.userId || 'anonymous'}`;

  return {
    ...result,
    status: statusMessage
  };
}

// ... (rest of the file remains unchanged)