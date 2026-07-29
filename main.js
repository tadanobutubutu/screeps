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

/* ---------- Task Management ---------- */
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
  await createAsyncUpdateTask('update gitstream-github-action to v4');
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

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update github/codeql-action to v4');
    await npmUpdate('github/codeql-action', 'v4');
    logging.log('info', `Successfully updated github/codeql-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update github/codeql-action: ${error.message}`);
    throw error;
  }
};

const updatePosthogJs = async () => {
  await updateDependencyVersions('posthog-js', 'v1.407.7');
};

const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.7');
    await npmUpdate('posthog-js', 'v1.407.7');
    logging.log('info', `Successfully updated posthog-js to v1.407.7`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthog-js: ${error.message}`);
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

const updateActionsStale = async () => {
  await updateDependencyVersions('actions/stale', 'v11');
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/stale to v11');
    await npmUpdate('actions/stale', 'v11');
    logging.log('info', `Successfully updated actions/stale to v11`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
  }
};

const updateTypeScript = async () => {
  try {
    await npmUpdate('typescript', '^7.0.2');
    logging.log('info', 'Successfully updated typescript to ^7.0.2');
  } catch (error) {
    logging.log('error', `Failed to update typescript: ${error.message}`);
    throw error;
  }
};

/* ---------- Schedule Awareness ---------- */
const isAwaitingSchedule = (dependency) => {
  const task = Array.from(tasks.values()).find(t => t.title.startsWith('update ') && t.title.includes(dependency));
  return task && !task.completed;
};

const createAllAwaitingSchedulePrs = async () => {
  const awaitingTasks = Array.from(tasks.values()).filter(task => task.tags && task.tags.includes('renovate') && !task.completed);
  awaitingTasks.forEach(task => {
    addTask(`Create PR for ${task.title}`, 'medium', ['auto-schedule']);
    logging.log('info', `Scheduled PR creation task for ${task.title}`);
  });
  return { scheduledPrTasks: awaitingTasks.length };
};

/* ---------- PR Title Handling ---------- */
const handlePrTitle = (title) => {
  if (title === undefined || title === null) {
    return { valid: false, reason: 'Empty title', score: 0 };
  }
  const trimmedTitle = title.trim();
  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(trimmedTitle);
  if (hasConvention === undefined || hasConvention === null) {
    return { valid: false, reason: 'Missing conventional commit prefix', score: 20 };
  }
  const lengthScore = trimmedTitle.length <= 72 ? 100 : 50;
  return { valid: true, reason: '', score: lengthScore };
};

const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr !== 'object') return false;
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') return false;
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) return true;
  const body = pr.data?.body ?? pr.body ?? '';
  const blockedComment = new RegExp("<!--\\s*recreate-branch=renovate", "i");
  if (blockedComment.test(body)) return true;
  const numberMatch = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};

const checkPavoukPr = willRecreateBlockedUpdate;

/* ---------- Emotion Functions ---------- */
const validateEmotion = (emotion) => {
  if (typeof emotion !== 'string') return false;
  const normalized = emotion.toLowerCase().trim();
  return ['happy', 'sad', 'angry', 'calm', 'excited', 'tired', 'anxious', 'confident'].includes(normalized);
};

const categorizeEmotion = (emotion) => {
  if (!validateEmotion(emotion)) return null;
  const positive = ['happy', 'excited', 'calm', 'confident'];
  const negative = ['sad', 'angry', 'anxious', 'tired'];
  const normalized = emotion.toLowerCase().trim();
  if (positive.includes(normalized)) return 'positive';
  if (negative.includes(normalized)) return 'negative';
  return 'neutral';
};

const analyzeEmotionText = (text) => {
  if (typeof text !== 'string') return { emotion: null, confidence: 0 };
  const emotionKeywords = {
    happy: ['joy', 'glad', 'pleased', 'delighted', 'content'],
    sad: ['unhappy', 'depressed', 'gloomy', 'melancholy', 'downcast'],
    angry: ['mad', 'furious', 'irritated', 'enraged', 'outrageous'],
    calm: ['peaceful', 'serene', 'tranquil', 'relaxed', 'composed'],
    excited: ['thrilled', 'eager', 'enthusiastic', 'animated', 'energetic'],
    tired: ['exhausted', 'weary', 'fatigued', 'drained', 'spent'],
    anxious: ['nervous', 'worried', 'concerned', 'apprehensive', 'uneasy'],
    confident: ['certain', 'sure', 'assured', 'self-reliant', 'steady']
  };
  const lowerText = text.toLowerCase();
  let bestEmotion = null;
  let bestCount = 0;
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    const count = keywords.filter(k => lowerText.includes(k)).length;
    if (count > bestCount) {
      bestCount = count;
      bestEmotion = emotion;
    }
  }
  const confidence = bestCount > 0 ? Math.min(100, bestCount * 20) : 0;
  return { emotion: bestEmotion, confidence };
};

const createEmotionProfile = (emotions) => {
  if (!Array.isArray(emotions)) return { emotions: [], dominant: null };
  const validEmotions = emotions.filter(validateEmotion);
  const counts = {};
  validEmotions.forEach(e => {
    const normalized = e.toLowerCase().trim();
    counts[normalized] = (counts[normalized] || 0) + 1;
  });
  let dominant = null;
  let maxCount = 0;
  for (const [emotion, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = emotion;
    }
  }
  return { emotions: validEmotions, dominant };
};

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
const trackStargazers = async (repo) => {
  if (!repo) return [];
  try {
    const result = execSync(`git ls-remote --heads origin | grep -i "refs/tags/${repo}"`, { encoding: 'utf8' });
    const lines = result.trim().split('\n').filter(l => l);
    return lines.map(line => ({ hash: line.split('\t')[0], ref: line.split('\t')[1] }));
  } catch (error) {
    return [];
  }
};

const identifyRunawayStargazers = () => {
  const now = Date.now();
  const threshold = now - 7 * 24 * 60 * 60 * 1000;
  return Array.from(stargazerData.entries())
    .filter(([_, data]) => data.lastActivity > threshold)
    .map(([id, data]) => ({ id, ...data }));
};

const getStargazerStats = () => {
  const total = stargazerData.size;
  const active = Array.from(stargazerData.values()).filter(d => d.active).length;
  return { total, active, inactive: total - active };
};

const detectStargazerAnomalies = () => {
  const anomalies = [];
  for (const [id, data] of stargazerData.entries()) {
    if (data.activityRate > 100) {
      anomalies.push({ id, type: 'high_activity', details: data });
    }
  }
  return anomalies;
};

const analyzeStargazerGrowth = () => {
  const entries = Array.from(stargazerData.entries());
  if (entries.length === 0) return { growthRate: 0, trend: 'stable' };
  const first = entries[0][1].lastActivity;
  const last = entries[entries.length - 1][1].lastActivity;
  const growthRate = ((entries.length - 1) / (last - first)) * 100 || 0;
  const trend = growthRate > 10 ? 'increasing' : growthRate < -10 ? 'decreasing' : 'stable';
  return { growthRate, trend };
};

const trackRunawayStargazers = identifyRunawayStargazers;

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
  const pendingSchedule = [
    { dependency: 'typescript', version: '^7.0.2', branch: 'typescript-7.x', type: 'chore(deps)', action: 'Update typescript to ^7.0.2' },
    { dependency: 'posthog-js', version: '1.407.7', branch: 'posthog-js-1.x', type: 'fix(deps)', action: 'Update posthog-js to v1.407.7' },
    { dependency: 'actions/stale', version: 'v11', branch: 'actions-stale-11.x', type: 'chore(deps)', action: 'Update actions/stale to v11' },
  ];

  const blockedEdited = [
    { dependency: '@sentry/browser', version: 'v10.69.0', branch: 'sentry-javascript-monorepo', type: 'fix(deps)', action: 'Update @sentry/browser to v10.69.0' },
  ];

  const blockedClosed = [
    { dependency: 'github/codeql-action', version: 'v4', branch: 'github-codeql-action-4.x', pr: 978, type: 'chore(deps)', action: 'Update github/codeql-action to v4' },
  ];

  const failedLookups = [
    { package: 'linear-bots/gitstream-github-action', reason: 'no-result', file: '.github/workflows/gitstream.yml' },
  ];

  const warnings = [
    { type: 'multiple-lock-files', message: 'Updating multiple npm lock files is deprecated and support will be removed in future versions.' },
  ];

  const allUpdates = [...pendingSchedule, ...blockedEdited, ...blockedClosed];
  const totalPending = pendingSchedule.length;
  const totalBlocked = blockedEdited.length + blockedClosed.length;
  const totalFailedLookups = failedLookups.length;

  logging.log('info', `Dependency Dashboard: ${totalPending} pending, ${totalBlocked} blocked, ${totalFailedLookups} failed lookups`);

  return {
    pendingSchedule,
    blockedEdited,
    blockedClosed,
    failedLookups,
    warnings,
    summary: {
      totalPending,
      totalBlocked,
      totalFailedLookups,
      totalUpdates: allUpdates.length,
    },
  };
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
  validateEmotion,
  categorizeEmotion,
  analyzeEmotionText,
  createEmotionProfile,
  getRandomInt,
  getRandomFloat,
  getRandomItem,
  shuffleArray,
  memoryVisualizer,
  trackStargazers,
  identifyRunawayStargazers,
  getStargazerStats,
  detectStargazerAnomalies,
  analyzeStargazerGrowth,
  trackRunawayStargazers,
  runPendingRenovateUpdates,
  dependencyDashboard,
  updateLinearBotsGitstreamGithubAction,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  updateLinearBotsGitstream,
  updatePosthogJs,
  updateActionsStale,
  updateTypeScript,
};