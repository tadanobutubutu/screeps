const { execSync } = require('child_process');

let isLintingRunning = false;

const runLinting = () => {
  if (isLintingRunning) return;
  isLintingRunning = true;
  try {
    execSync('npx eslint --fix .', { stdio: 'inherit' });
  } catch (error) {
    console.error('Linting failed:', error.message);
  } finally {
    isLintingRunning = false;
  }
};

const handlePrTitle = (title) => {
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { valid: false, reason: 'Empty title', score: 0 };
  }

  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?: .+/i.test(trimmedTitle);
  if (!hasConvention) {
    return { valid: false, reason: 'Missing conventional commit prefix', score: 20 };
  }

  const lengthScore = trimmedTitle.length <= 72 ? 100 : 50;
  return { valid: true, reason: 'Valid title', score: lengthScore };
};

const validateEmotion = (emotion) => {
  if (!emotion || typeof emotion !== 'object') {
    return { valid: false, errors: ['Invalid emotion object'] };
  }

  const errors = [];
  if (typeof emotion.name !== 'string' || !emotion.name.trim()) {
    errors.push('Emotion name must be a non-empty string');
  }
  if (!Array.isArray(emotion.tags)) {
    errors.push('Emotion tags must be an array');
  }
  if (typeof emotion.intensity !== 'number' || emotion.intensity < 0 || emotion.intensity > 1) {
    errors.push('Emotion intensity must be a number between 0 and 1');
  }
  if (!emotion.category || typeof emotion.category !== 'string') {
    errors.push('Emotion category is required and must be a string');
  }

  return { valid: errors.length === 0, errors };
};

const categorizeEmotion = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('glad')) {
    return 'joyful';
  } else if (lowerText.includes('sad') || lowerText.includes('sorrow') || lowerText.includes('unhappy')) {
    return 'sorrowful';
  } else if (lowerText.includes('angry') || lowerText.includes('frustrat') || lowerText.includes('irritat')) {
    return 'angry';
  } else if (lowerText.includes('fear') || lowerText.includes('scared') || lowerText.includes('anxi')) {
    return 'fearful';
  } else if (lowerText.includes('surpris') || lowerText.includes('shock') || lowerText.includes('amaz')) {
    return 'surprised';
  } else {
    return 'neutral';
  }
};

const analyzeEmotionText = (text) => {
  if (!text || typeof text !== 'string') {
    return { emotion: 'neutral', confidence: 0 };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { emotion: 'neutral', confidence: 0 };
  }

  const category = categorizeEmotion(trimmed);
  let confidence = 0.5;

  const positiveWords = ['happy', 'joy', 'love', 'great', 'excellent', 'wonderful', 'fantastic', 'amazing', 'good', 'nice', 'awesome', 'brilliant', 'delight', 'cheerful', 'pleased'];
  const negativeWords = ['sad', 'bad', 'terrible', 'horrible', 'awful', 'angry', 'upset', 'disappointed', 'hate', 'worst', 'dreadful', 'miserable', 'depressed', 'frustrated', 'annoyed'];

  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(trimmed)) positiveCount++;
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(trimmed)) negativeCount++;
  });

  if (positiveCount > negativeCount) {
    confidence = Math.min(0.5 + positiveCount * 0.1, 1.0);
  } else if (negativeCount > positiveCount) {
    confidence = Math.min(0.5 + negativeCount * 0.1, 1.0);
  }

  return { emotion: category, confidence: Math.round(confidence * 100) / 100 };
};

const batchAnalyzeEmotions = (texts) => {
  if (!Array.isArray(texts)) {
    return [];
  }

  return texts.map((text) => ({
    text,
    analysis: analyzeEmotionText(text),
  }));
};

const createEmotionProfile = (name, initialEmotions = []) => {
  const profile = {
    name,
    createdAt: new Date(),
    emotions: initialEmotions.map((em) => ({
      ...em,
      timestamp: em.timestamp || new Date(),
    })),
    getAverageConfidence() {
      if (this.emotions.length === 0) return 0;
      const sum = this.emotions.reduce((acc, curr) => acc + curr.analysis.confidence, 0);
      return Math.round((sum / this.emotions.length) * 100) / 100;
    },
    getDominantEmotion() {
      if (this.emotions.length === 0) return null;
      let maxConf = 0;
      let dominant = null;
      this.emotions.forEach((em) => {
        if (em.analysis.confidence > maxConf) {
          maxConf = em.analysis.confidence;
          dominant = em.analysis.emotion;
        }
      });
      return dominant;
    },
  };

  return profile;
};

const getEmotionTrends = (emotionData) => {
  if (!Array.isArray(emotionData) || emotionData.length === 0) {
    return { trends: [], summary: 'No data available' };
  }

  const trends = [];
  const grouped = {};

  emotionData.forEach((entry) => {
    const { emotion, confidence, timestamp } = entry;
    if (!grouped[emotion]) {
      grouped[emotion] = [];
    }
    grouped[emotion].push({ confidence, timestamp: timestamp || new Date() });
  });

  Object.entries(grouped).forEach(([emotion, entries]) => {
    const avgConfidence = entries.reduce((acc, cur) => acc + cur.confidence, 0) / entries.length;
    const trend = entries.length > 1 ? (entries[entries.length - 1].confidence >= entries[0].confidence ? 'improving' : 'declining') : 'stable';
    trends.push({ emotion, count: entries.length, averageConfidence: Math.round(avgConfidence * 100) / 100, trend });
  });

  return { trends, summary: `Analyzed ${emotionData.length} emotion entries across ${Object.keys(grouped).length} categories` };
};

const detectEmotionConflicts = (emotions) => {
  if (!Array.isArray(emotions) || emotions.length < 2) {
    return { conflicts: [], hasConflict: false };
  }

  const conflicts = [];
  for (let i = 0; i < emotions.length - 1; i++) {
    const current = emotions[i];
    const next = emotions[i + 1];
    if (current.emotion !== next.emotion) {
      const intensityDiff = Math.abs(current.confidence - next.confidence);
      if (intensityDiff > 0.5) {
        conflicts.push({
          from: current.emotion,
          to: next.emotion,
          intensityDifference: intensityDiff,
          position: i,
        });
      }
    }
  }

  return { conflicts, hasConflict: conflicts.length > 0 };
};

const filterEmotionsByCategory = (emotions, category) => {
  if (!Array.isArray(emotions)) return [];
  if (!category) return [...emotions];
  return emotions.filter((emotion) => emotion.category && emotion.category.toLowerCase() === category.toLowerCase());
};

module.exports = {
  runLinting,
  handlePrTitle,
  validateEmotion,
  categorizeEmotion,
  analyzeEmotionText,
  batchAnalyzeEmotions,
  createEmotionProfile,
  getEmotionTrends,
  detectEmotionConflicts,
  filterEmotionsByCategory,
};

module.exports.real = {
  runLinting,
  handlePrTitle,
  validateEmotion,
  categorizeEmotion,
  analyzeEmotionText,
  batchAnalyzeEmotions,
  createEmotionProfile,
  getEmotionTrends,
  detectEmotionConflicts,
  filterEmotionsByCategory,
};