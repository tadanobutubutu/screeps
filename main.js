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
  if (typeof emotion !== 'string' || emotion.trim() === '') {
    return { valid: false, reason: 'Invalid emotion type' };
  }
  const validEmotions = ['happy', 'sad', 'angry', 'excited', 'calm', 'anxious', 'frustrated', 'confused'];
  const normalizedEmotion = emotion.toLowerCase().trim();
  if (validEmotions.includes(normalizedEmotion)) {
    return { valid: true, reason: '', normalized: normalizedEmotion };
  }
  return { valid: false, reason: `Unknown emotion: ${emotion}` };
};

const categorizeEmotion = (emotion) => {
  const validation = validateEmotion(emotion);
  if (!validation.valid) {
    return { category: 'unknown', intensity: 0 };
  }
  const emotionalCategories = {
    positive: ['happy', 'excited', 'calm'],
    negative: ['sad', 'angry', 'anxious', 'frustrated'],
    neutral: ['confused']
  };
  const normalizedEmotion = validation.normalized;
  for (const [category, emotions] of Object.entries(emotionalCategories)) {
    if (emotions.includes(normalizedEmotion)) {
      return { category, intensity: 1 };
    }
  }
  return { category: 'unknown', intensity: 0 };
};

const analyzeEmotionText = (text) => {
  if (typeof text !== 'string' || text.trim() === '') {
    return { emotions: [], sentiment: 'neutral' };
  }
  const emotionKeywords = {
    happy: ['joy', 'glad', 'pleased', 'delighted', 'content'],
    sad: ['unhappy', 'depressed', 'gloomy', 'melancholy', 'sorrow'],
    angry: ['mad', 'furious', 'irate', 'enraged', 'outraged'],
    excited: ['thrilled', 'elated', 'euphoric', 'overjoyed', 'exhilarated'],
    calm: ['peaceful', 'serene', 'tranquil', 'relaxed', 'composed'],
    anxious: ['nervous', 'worried', 'uneasy', 'distressed', 'perturbed'],
    frustrated: ['irritated', 'annoyed', 'disgusted', 'disappointed', 'disillusioned'],
    confused: ['bewildered', 'puzzled', 'mystified', 'flummoxed', 'baffled']
  };
  const textLower = text.toLowerCase();
  const detectedEmotions = [];
  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    if (keywords.some(keyword => textLower.includes(keyword))) {
      detectedEmotions.push(emotion);
    }
  }
  let sentiment = 'neutral';
  if (detectedEmotions.length > 0) {
    const categories = detectedEmotions.map(e => categorizeEmotion(e).category);
    const positiveCount = categories.filter(c => c === 'positive').length;
    const negativeCount = categories.filter(c => c === 'negative').length;
    if (positiveCount > negativeCount) {
      sentiment = 'positive';
    } else if (negativeCount > positiveCount) {
      sentiment = 'negative';
    }
  }
  return { emotions: detectedEmotions, sentiment };
};

const createEmotionProfile = (userId, initialEmotion = 'calm') => {
  if (!userId || typeof userId !== 'string') {
    return null;
  }
  const validation = validateEmotion(initialEmotion);
  const emotion = validation.valid ? validation.normalized : 'calm';
  return {
    userId,
    currentEmotion: emotion,
    history: [{ emotion, timestamp: new Date().toISOString() }],
    moodScore: categorizeEmotion(emotion).intensity
  };
};

const getRandomInt = (min, max) => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 0;
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min, max, decimals = 2) => {
  if (typeof min !== 'number' || typeof max !== 'number') {
    return 0;
  }
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
};

const getRandomItem = (array) => {
  if (!Array.isArray(array) || array.length === 0) {
    return null;
  }
  return array[Math.floor(Math.random() * array.length)];
};

const shuffleArray = (array) => {
  if (!Array.isArray(array)) {
    return [];
  }
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/* ---------- Stargazer Tracking ---------- */
const trackStargazers = (repo) => {
  if (!repo || typeof repo !== 'string') {
    return { success: false, error: 'Invalid repository' };
  }
  stargazerData.set(repo, {
    count: 0,
    lastUpdated: new Date().toISOString(),
    history: []
  });
  return { success: true, repo };
};

const identifyRunawayStargazers = () => {
  const runaway = [];
  for (const [repo, data] of stargazerData.entries()) {
    if (data.count > 1000) {
      runaway.push({ repo, count: data.count });
    }
  }
  return runaway;
};

const getStargazerStats = (repo) => {
  const data = stargazerData.get(repo);
  if (!data) {
    return { success: false, error: 'Repository not found' };
  }
  return { success: true, stats: data };
};

const detectStargazerAnomalies = (repo) => {
  const data = stargazerData.get(repo);
  if (!data || !data.history || data.history.length < 2) {
    return { anomaly: false };
  }
  const history = data.history;
  const recentGrowth = history.slice(-5);
  const avgGrowth = recentGrowth.reduce((sum, h) => sum + (h.count || 0), 0) / recentGrowth.length;
  const anomaly = avgGrowth > 500;
  return { anomaly, avgGrowth, threshold: 500 };
};

const analyzeStargazerGrowth = (repo) => {
  const data = stargazerData.get(repo);
  if (!data || !data.history || data.history.length === 0) {
    return { growth: 0, trend: 'stable' };
  }
  const history = data.history;
  const firstCount = history[0]?.count || 0;
  const lastCount = history[history.length - 1]?.count || 0;
  const growth = lastCount - firstCount;
  const trend = growth > 100 ? 'rapid' : growth > 0 ? 'steady' : 'declining';
  return { growth, trend };
};

const trackRunawayStargazers = () => {
  return identifyRunawayStargazers();
};

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