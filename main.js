// utils.emotions.js
// ... (all existing code before line 365)

// Fix the parsing error at line 365
function processEmotionData(data) {
  try {
    // Ensure proper closing of parentheses and brackets
    return JSON.parse(data).map(emotion => ({
      name: emotion.name,
      intensity: emotion.intensity || 0,
      timestamp: new Date().toISOString()
    }));
  } catch (error) {
    console.error('Error processing emotion data:', error);
    return [];
  }
}

// ... (all remaining existing code)