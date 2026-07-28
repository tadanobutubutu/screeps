"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
let isLintingRunning = false;
const runLinting = () => {
  if (isLintingRunning) return;
  isLintingRunning = true;
  try {
    execSync('npx eslint --fix.', { stdio: 'inherit' });
  } catch (error) {
    console.error('Linting failed:', error.message);
  } finally {
    isLintingRunning = false;
  }
};
const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr!== 'object') {
    return false;
  }
  const title = pr.data?.title?? pr.title;
  if (typeof title!== 'tring') {
    return false;
  }

  // Check for Pavouk PR (existing)
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) {
    return true;
  }

  // Check PR body for Renovate comment indicating a blocked PR
  const body = pr.data?.body?? pr.body?? '';
  const blockedComment = /<!--\s*recreate-branch=renovate/i;
  if (blockedComment.test(body)) {
    return true;
  }

  // Existing number match logic
  const numberMatch = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};
const checkPavoukPr = willRecreateBlockedUpdate;
const logging = {
    log: (level, message) => {
        if (level === 'FAILSAFE') {
            console[level]?.call?.console?.log?.(`FailSafe: ${message}`);
        } else {
            console[level]?.( `${level}: ${message}` );
        }
    }
};
let taskIdCounter = 0;
const tasks = [];
const addTask = (title, priority = 'edium', tags = []) => {
    taskIdCounter++;
    tasks.push({ id: taskIdCounter, title, priority, tags, completed: false, });
    return taskIdCounter;
};
const getTaskById = (taskId) => {
    return tasks.find((task) => task.id === taskId) || null;
};
const npmUpdate = async (_dependency, _newVersion) => {
  // Placeholder for future renovate-cli implementation
  return Promise.resolve();
};

const updateDependencyVersions = async (dependency, newVersion) => {
  const taskTitle = `Update dependency ${dependency} to ${newVersion}`;
  try {
    await npmUpdate(dependency, newVersion);
    logging.log('info', `Successfully updated ${dependency} to ${newVersion}`);
    addTask(taskTitle, 'high', ['renovate']);
  } catch (error) {
    logging.log('error', `Failed to update ${dependency}: ${error.message}`);
    throw error;
  }
};

const updateNpmPackage = async ({ name, version }) => {
  try {
    const taskId = await createAsyncUpdateTask(`update ${name} to ${version}`);
    await updateDependencyVersions(name, version);
    logging.log('info', `Successfully updated ${name} to ${version}`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update ${name}: ${error.message}`);
    throw error;
  }
};

const createAsyncUpdateTask = async (title, tags = []) => {
  try {
    const taskId = addTask(title, 'edium', tags);
    logging.log('info', `Created task: ${title}`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to create task: ${error.message}`);
    throw error;
  }
};

const updateGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update gitstream-github-action to v4');
    await updateNpmPackage({ name: 'gitstream-github-action', version: 'v4' });
    logging.log('info', `Successfully updated gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update gitstream-github-action: ${error.message}`);
    throw error;
  }
};

const updateActionsLabeler = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/labeler action to v7');
    await updateNpmPackage({ name: 'actions/labeler', version: 'v7' });
    logging.log('info', `Successfully updated actions/labeler to v7`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/labeler: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstream = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream to latest');
    await updateNpmPackage({ name: 'linear-bots/gitstream', version: 'latest' });
    logging.log('info', `Successfully updated linear-bots/gitstream to latest`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream: ${error.message}`);
    throw error;
  }
};

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to latest');
    await updateNpmPackage({ name: 'linear-bots/gitstream-github-action', version: 'latest' });
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to latest`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    throw error;
  }
};

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update github/codeql-action to v4');
    await updateNpmPackage({ name: 'github/codeql-action', version: 'v4' });
    logging.log('info', `Successfully updated github/codeql-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
    throw error;
  }
};

const updatePosthohJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update posthoh_js to v1.407.3');
    await updateNpmPackage({ name: 'posthoh_js', version: 'v1.407.3' });
    logging.log('info', `Successfully updated posthoh_js to v1.407.3`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthoh_js: ${error.message}`);
    throw error;
  }
};

const handleLockFileWarning = async () => {
  try {
    const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
    logging.log('warn', 'Multiple lock files detected. Consider consolidating to a single lock file.');
    logging.log('info', 'Lock file consolidation task created');
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to handle lock file warning: ${error.message}`);
    throw error;
  }
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/stale to v11');
    await updateNpmPackage({ name: 'actions/stale', version: 'v11' });
    logging.log('info', `Successfully updated actions/stale to v11`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
  }
};

const updateTypeScript = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update typescript to ^7.0.2');
    await updateNpmPackage({ name: 'typescript', version: '^7.0.2' });
    logging.log('info', `Successfully updated typescript to ^7.0.2`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update typescript: ${error.message}`);
    throw error;
  }
};

const isAwaitingSchedule = (dependency) => {
  const task = tasks.find((task) => task.title.startsWith('update ') && task.title.includes(dependency));
  return task &&!task.completed;
};

const fixLintingIssues = () => {
  try {
    const result = spawnSync('npx', ['eslint', '--fix', './tests/**/*.js', './src/managers/roomManager.js', './main.js'], { stdio: 'inherit' });
    if (result.status === 0) {
      logging.log('info', 'ESLint fix completed successfully.');
    } else {
      logging.log('error', 'ESLint fix failed.');
    }
  } catch (error) {
    logging.log('error', `Failed to run ESLint fix: ${error.message}`);
  }
};

const handlePrTitle = (title) => {
  if (typeof title !== 'tring') {
    return { valid: false, reason: 'Invalid title type', score: 0 };
  }
  const trimmedTitle = title.trim();
  // Check for empty title
  if (!trimmedTitle || trimmedTitle === '') {
    return { valid: false, reason: 'Empty title', score: 0 };
  }

  // Check for conventional commit prefix
  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(title);
  if (!hasConvention) {
    return { valid: false, reason: 'Missing conventional commit prefix', score: 20 };
  }

  const lengthScore = trimmedTitle.length <= 72 ? 100 : 50;
  return { valid: true, reason: 'Valid title', score: lengthScore };
};

const validateEmotion = (emotion) => {
    if (!emotion || typeof emotion!== 'tring' ||!emotion.name.trim()) {
        return { valid: false, errors: ['Invalid emotion object'] };
    }
    const errors = [];
    if (typeof emotion.name!== 'tring' ||!emotion.name.trim()) {
        errors.push('Emotion name must be a non-empty string');
    }
    if (!Array.isArray(emotion.tags)) {
        errors.push('Emotion tags must be an array');
    }
    if (typeof emotion.intensity!== 'number' || emotion.intensity < 0 || emotion.intensity > 1) {
        errors.push('Emotion intensity must be a number between 0 and 1');
    }
    if (!emotion.category || typeof emotion.category!== 'tring') {
        errors.push('Emotion category is required and must be a string');
    }
    return { valid: errors.length === 0, errors };
};

const categorizeEmotion = (text) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes('happy') || lowerText.includes('joy') || lowerText.includes('glad')) {
    return 'joyful';
  } else if (lowerText.includes('sad') || lowerText.includes('sorrow') || lowerText.includes('unhappy')) {
    return 'orrowful';
  } else if (lowerText.includes('angry') || lowerText.includes('frustrat') || lowerText.includes('irritat')) {
    return 'angry';
  } else if (lowerText.includes('fear') || lowerText.includes('scared') || lowerText.includes('anxi')) {
    return 'fearful';
  } else if (lowerText.includes('surpris') || lowerText.includes('shock') || lowerText.includes('amaz')) {
    return 'urprised';
  } else {
    return 'neutral';
  }
};

const analyzeEmotionText = (text) => {
  if (!text || typeof text!== 'tring') {
    return { emotion: 'neutral', confidence: 0 };
  }

  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { emotion: 'neutral', confidence: 0 };
  }

  const category = categorizeEmotion(trimmed);
  let confidence = 0.5;

  const positiveWords = [
    'happy',
    'joy',
    'love',
    'great',
    'excellent',
    'wonderful',
    'fantastic',
    'amazing',
    'good',
    'nice',
    'awesome',
    'brilliant',
    'delight',
    'cheerful',
    'pleased',
  ];
  const negativeWords = [
    'ad',
    'bad',
    'terrible',
    'horrible',
    'awful',
    'angry',
    'upset',
    'disappointed',
    'hate',
    'worst',
    'dreadful',
    'iserable',
    'depressed',
    'frustrated',
    'annoyed',
  ];

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
      ..em,
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
    return {
      trends: [],
      summary: 'No data available',
    };
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
    const trend = entries.length > 1? (entries[entries.length - 1].confidence >= entries[0].confidence? 'improving' : 'declining') : 'table';
    trends.push({
      emotion,
      count: entries.length,
      averageConfidence: Math.round(avgConfidence * 100) / 100,
      trend,
    });
  });

  return {
    trends,
    summary: `Analyzed ${emotionData.length} emotion entries across ${Object.keys(grouped).length} categories`,
  };
};

const detectEmotionConflicts = (emotions) => {
  if (!Array.isArray(emotions) || emotions.length < 2) {
    return { conflicts: [], hasConflict: false };
  }

  const conflicts = [];
  for (let i = 0; i < emotions.length - 1; i++) {
    const current = emotions[i];
    const next = emotions[i + 1];
    if (current.emotion!== next.emotion) {
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
  if (category === undefined || category === null) return [...emotions];
  return emotions.filter((emotion) => emotion.category && emotion.category.toLowerCase() === category.toLowerCase());
};

module.exports = {
  logging,
  addTask,
  getTaskById,
  npmUpdate,
  updateDependencyVersions,
  updateNpmPackage,
  createAsyncUpdateTask,
  updateGitstreamGithubAction,
  updateActionsLabeler,
  updateLinearBotsGitstream,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthohJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  updateTypeScript,
  isAwaitingSchedule,
  willRecreateBlockedUpdate,
  checkPavoukPr,
  handlePrTitle,
  validateEmotion,
  categorizeEmotion,
  analyzeEmotionText,
  batchAnalyzeEmotions,
  createEmotionProfile,
  getEmotionTrends,
  detectEmotionConflicts,
  filterEmotionsByCategory
};

module.exports.real = {...module.exports };