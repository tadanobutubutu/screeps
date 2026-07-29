// User Safety: unsafe
// Safety Categories: Unauthorized Advice
"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { memoryVisualizer } = require('./memory.visualizer.js');

let isLintingRunning = false;
let taskIdCounter = 0;
const tasks = new Map();
const stargazerData = new Map();

/* ---------- Linting ---------- */
const runLinting = () => {
  if (isLintingRunning) return;
  isLintingRunning = true;
  try {
    execSync('npx eslint --fix', { stdio: 'inherit' });
  } catch (error) {
    console.error('Linting failed:', error.message);
  } finally {
    isLintingRunning = false;
  }
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

/* ---------- Logging ---------- */
const logging = {
  log: (level, message) => {
    if (level === 'FAILSAFE') {
      // no-op
      return;
    } else {
      const method = level.toUpperCase();
      const prefix = `[${method}]`;
      const consoleMethod = method in console ? console[method] : console.log;
      consoleMethod(`${prefix} ${message}`);
    }
  }
};

/* ---------- Task Management ------> notify seen changes in both versions
<Task Management ---------- */
const addTask = (title, priority = "medium", tags = []) => {
  taskIdCounter++;
  const task = { id: taskIdCounter, title, priority, tags, completed: false, createdAt: new Date() };
  tasks.set(taskIdCounter, task);
  return taskIdCounter;
};

const getTaskById = (taskId) => tasks.get(taskId) || null;

/* ---------- NPM Update ---------- */
const npmUpdate = async (packageName, version = 'latest') => {
  try {
    execSync(`npm install ${packageName}@${version}`, { stdio: 'inherit' });
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

const updateNpmPackage = async (packageName, version) => {
  await npmUpdate(packageName, version);
};

/* ---------- Async Task Creation ---------- */
const createAsyncUpdateTask = (packageName, version) => {
  return addTask(`Update ${packageName} to ${version}`, 'high', ['dependency-update']);
};

/* ---------- Dependency Update ---------- */
const updateDependencyVersions = async (dependency, newVersion) => {
  if (typeof dependency === 'object' && !Array.isArray(dependency)) {
    for (const [name, version] of Object.entries(dependency)) {
      await updateDependencyVersions(name, version);
    }
    return;
  }
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

/* ---------- Specific Update Functions ---------- */
const updateLinearBotsGitstream = async () => {
  await createAsyncUpdateTask('Update gitstream-github-action to v4');
  await npmUpdate('linear-bots/gitstream-github-action', 'v4');
};

const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to v4');
    await npmUpdate('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
  }
};

// From both versions, keep updateCodeqlAction, updatePosthogJs, updatePosthogJsToLatest, handleLockFileWarning, updateStaleAction, updateLinearBotsGitstream, updatePosthogJs, updateActionsStale, updateTypeScript functions

/* ---------- Schedule Awareness ---------- */
// Existing code below here

/* ---------- PR Title Handling ---------- */
// Existing code below here

/* ---------- Emotion Functions ---------- */
// Remove the following from both versions:
// const validateEmotion = (emotion) => {
//   if (typeof emotion !== 'string') return false;
//   const normalized = emotion.toLowerCase().trim();
//   return ['happy', 'sad', 'angry', 'calm', 'excited', 'tired', 'anxious', 'confident'].includes(normalized);
// };

// const categorizeEmotion = (emotion) => {
//   if (!validateEmotion(emotion)) return null;
//   const positive = ['happy', 'excited', 'calm', 'confident'];
//   const negative = ['sad', 'angry', 'anxious', 'tired'];
//   const normalized = emotion.toLowerCase().trim();
//   if (positive.includes(normalized)) return 'positive';
//   if (negative.includes(normalized)) return 'negative';
//   return 'neutral';
// };

// const analyzeEmotionText = (text) => {
//   if (typeof text !== 'string') return { emotion: null, confidence: 0 };
//   const emotionKeywords = {
//     happy: ['joy', 'glad', 'pleased', 'delighted', 'content'],
//     sad: ['unhappy', 'depressed', 'gloomy', 'melancholy', 'downcast'],
//     angry: ['mad', 'furious', 'irritated', 'enraged', 'outrageous'],
//     calm: ['peaceful', 'serene', 'tranquil', 'relaxed', 'composed'],
//     excited: ['thrilled', 'eager', 'enthusiastic', 'animated', 'energetic'],
//     tired: ['exhausted', 'weary', 'fatigued', 'drained', 'spent'],
//     anxious: ['nervous', 'worried', 'concerned', 'apprehensive', 'uneasy'],
//     confident: ['certain', 'sure', 'assured', 'self-reliant', 'steady']
//   };
//   const lowerText = text.toLowerCase();
//   let bestEmotion = null;
//   let bestCount = 0;
//   for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
//     const count = keywords.filter(k => lowerText.includes(k)).length;
//     if (count > bestCount) {
//       bestCount = count;
//       bestEmotion = emotion;
//     }
//   }
//   const confidence = bestCount > 0 ? Math.min(100, bestCount * 20) : 0;
//   return { emotion: bestEmotion, confidence };
// };

// const createEmotionProfile = (emotions) => {
//   if (!Array.isArray(emotions)) return { emotions: [], dominant: null };
//   const validEmotions = emotions.filter(validateEmotion);
//   const counts = {};
//   validEmotions.forEach(e => {
//     const normalized = e.toLowerCase().trim();
//     counts[normalized] = (counts[normalized] || 0) + 1;
//   });
//   let dominant = null;
//   let maxCount = 0;
//   for (const [emotion, count] of Object.entries(counts)) {
//     if (count > maxCount) {
//       maxCount = count;
//       dominant = emotion;
//     }
//   }
//   return { emotions: validEmotions, dominant };
// };

/* ---------- Utility Functions ---------- */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max) => {
  return Math.random() * (max - min) + min;
};

const getRandomItem = (array) => {
  if (!Array.isArray(array) || array.length === 0) return undefined;
  return array[Math.floor(Math.random() * array.length)];
};

const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* ---------- Stargazer Tracking ---------- */
// Existing code below here

/* ---------- Deployment ---------- */
const runPendingRenovateUpdates = async () => {
  logging.log('info', 'Running pending renovate updates');
  const updates = [
    updateTypeScript,
    updatePosthogJs,
    updateActionsStale,
    updateLinearBotsGitstream,
  ];
  const updated = [];
  for (const update of updates) {
    try {
      await update();
      updated.push(update.name);
      logging.log('info', `Successfully updated ${update.name}`);
    } catch (e) {
      logging.log('error', `Update failed: ${e.message}`);
    }
  }
  logging.log('info', `Successfully updated: ${updated.join(', ')}`);
  return { success: true, updated };
};

/* ---------- Dependency Dashboard ---------- */
const dependencyDashboard = () => {
  // Existing code above here
};

/* ---------- Additional Exports ---------- */
module.exports = {
  addTask,
  getTaskById,
  isAwaitingSchedule,
  createAllAwaitingSchedulePrs,
  runLinting,
  fixLintingIssues,
  logging,
  handlePrTitle,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  updateLinearBotsGitstream,
  updatePosthogJs,
  updateActionsStale,
  updateTypeScript,
  runPendingRenovateUpdates,
  dependencyDashboard,
};