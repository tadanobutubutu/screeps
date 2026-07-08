// utils/emotions.js

// Mapping of emotion names to emoji representations
const emotionEmojiMap = {
  happy: '😊',
  sad: '😢',
  angry: '😠',
  surprise: '😲',
  fear: '😱',
  disgust: '🤢',
  love: '❤️',
  // Add more emotions and emojis as needed
};

// Export the list of available emotions
export const emotions = Object.keys(emotionEmojiMap);

// Get the emoji for a given emotion (returns empty string if not found)
export function getEmoji(emotion) {
  return emotionEmojiMap[emotion] ?? '';
}

// Get a random emotion from the list
export function randomEmotion() {
  const keys = Object.keys(emotionEmojiMap);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  return { emotion: randomKey, emoji: emotionEmojiMap[randomKey] };
}
