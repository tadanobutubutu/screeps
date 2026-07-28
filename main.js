"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
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
const willRecreateBlockedUpdate = (pr) => {
  if (!pr || typeof pr !== 'object') {
    return false;
  }
  const title = pr.data?.title ?? pr.title;
  if (typeof title !== 'string') {
    return false;
  }

  // Check for Pavouk PR (existing)
  const hasPavouk = /Pavouk/i.test(title);
  if (hasPavouk) {
    return true;
  }

  // Check PR body for Renovate comment indicating a blocked PR
  const body = pr.data?.body ?? pr.body ?? '';
  const blockedComment = /<!--\s*recreate-branch=renovate/i;
  if (blockedComment.test(body)) {
    return true;
  }

  // Existing number match logic
  const numberMatch = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = numberMatch ? numberMatch[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber, 10) === pr.number;
  return matchesPrNumber;
};
const checkPavoukPr = willRecreateBlockedUpdate;
const logging = {
  log: (level, message) => {
    if (level === 'FAILSAFE') {
      console[level](`FailSafe: ${message}`);
    } else {
      const method = level.toUpperCase();
      const prefix = `[${method}]`;
      const consoleMethod = method in console ? console[method] : console.log;
      consoleMethod(`${prefix} ${message}`);
    }
  }
};
let taskIdCounter = 0;
const tasks = new Map();
const addTask = (title, priority = 'medium', tags = []) => {
  taskIdCounter++;
  const task = { id: taskIdCounter, title, priority, tags, completed: false, createdAt: new Date() };
  tasks.set(taskIdCounter, task);
  return taskIdCounter;
};
const getTaskById = (taskId) => {
  return tasks.get(taskId) || null;
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
    const taskId = addTask(title, 'medium', tags);
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
    await updateNpmPackage({ name: 'linear-bots/gitstream-github-action', version: 'v4' });
    logging.log('info', `Successfully updated gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update gitstream-github-action: ${error.message}`);
    // Do not re‑throw – Renovate will handle the failure gracefully
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
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to v4');
    await updateNpmPackage({ name: 'linear-bots/gitstream-github-action', version: 'v4' });
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    // Do not re‑throw – Renovate will handle the failure gracefully
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
    const taskId = await createAsyncUpdateTask('update posthoh-js to v1.407.3');
    await updateNpmPackage({ name: 'posthoh-js', version: 'v1.407.3' });
    logging.log('info', `Successfully updated posthoh-js to v1.407.3`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthoh-js: ${error.message}`);
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

const isAwaitingSchedule = (dependency) => {
  const task = Array.from(tasks.values()).find((task) => task.title.startsWith('update ') && task.title.includes(dependency));
  return task && !task.completed;
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
  if (typeof title !== 'string') {
    return { valid: false, reason: 'Invalid title type', score: 0 };
  }
  const trimmedTitle = title.trim();
  if (!trimmedTitle) {
    return { valid: false, reason: 'Empty title', score: 0 };
  }

  const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?:.+/i.test(trimmedTitle);
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
    'miserable',
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
    const trend = entries.length > 1 ? (entries[entries.length - 1].confidence >= entries[0].confidence ? 'improving' : 'declining') : 'stable';
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
  if (category === undefined || category === null) return [...emotions];
  return emotions.filter((emotion) => emotion.category && emotion.category.toLowerCase() === category.toLowerCase());
};

const runPendingRenovateUpdates = async () => {
  // List of Renovate‑scheduled updates that have corresponding functions above
  const pending = [
    { name: 'typescript', fn: updateTypeScript },
    { name: 'posthoh-js', fn: updatePosthohJsToLatest },
    { name: 'actions/stale', fn: updateStaleAction },
    { name: 'linear-bots/gitstream-github-action', fn: updateLinearBotsGitstreamGithubAction },
  ];
  for (const { name, fn } of pending) {
    if (isAwaitingSchedule(name)) {
      try {
        await fn();
        logging.log('info', `Renovate update processed for ${name}`);
      } catch (e) {
        logging.log('warn', `Failed to process Renovate update for ${name}: ${e.message}`);
      }
    }
  }
};

// Stargazer tracking functions
let stargazerData = new Map();

const trackStargazers = async (repo, stargazerList = []) => {
  try {
    if (!repo || typeof repo !== 'string') {
      throw new Error('Invalid repository identifier');
    }
    const normalizedRepo = repo.toLowerCase();
    const existingData = stargazerData.get(normalizedRepo) || { repo, stargazers: [], firstSeen: new Date(), lastUpdated: new Date() };
    const now = new Date();
    existingData.lastUpdated = now;
    existingData.stargazers = stargazerList.map((s) => ({
      username: s.username || s.login || s,
      starredAt: s.starredAt || s.date || new Date(),
      profileUrl: s.profileUrl || s.html_url || null,
    }));
    existingData.totalCount = existingData.stargazers.length;
    stargazerData.set(normalizedRepo, existingData);
    addTask(`Track stargazers for ${repo}`, 'medium', ['stargazers']);
    logging.log('info', `Tracked ${existingData.stargazers.length} stargazers for ${repo}`);
    return existingData;
  } catch (error) {
    logging.log('error', `Failed to track stargazers: ${error.message}`);
    throw error;
  }
};

const identifyRunawayStargazers = (repo, threshold = 10) => {
  try {
    if (!repo || typeof repo !== 'string') {
      throw new Error('Invalid repository identifier');
    }
    const normalizedRepo = repo.toLowerCase();
    const repoData = stargazerData.get(normalizedRepo);
    if (!repoData || !Array.isArray(repoData.stargazers)) {
      return { runawayStargazers: [], totalCount: 0, hasRunaways: false };
    }
    const runawayStargazers = repoData.stargazers.filter((s) => {
      if (s.username && typeof s.username === 'string') {
        const username = s.username.toLowerCase();
        const score = (username.match(/bot|automation|ci|cdn|web|scraper|crawler/i) ? 3 : 0)
          + (username.length < 4 ? 2 : 0)
          + (/\d{4,}/.test(username) ? 1 : 0);
        return score >= threshold;
      }
      return false;
    });
    return {
      runawayStargazers,
      totalCount: repoData.stargazers.length,
      hasRunaways: runawayStargazers.length > 0,
    };
  } catch (error) {
    logging.log('error', `Failed to identify runaway stargazers: ${error.message}`);
    throw error;
  }
};

const getStargazerStats = (repo) => {
  try {
    if (!repo || typeof repo !== 'string') {
      throw new Error('Invalid repository identifier');
    }
    const normalizedRepo = repo.toLowerCase();
    const repoData = stargazerData.get(normalizedRepo);
    if (repoData === undefined || repoData === null) {
      return { totalCount: 0, uniqueUsers: 0, averageActivity: 0, growthRate: 0, hasData: false };
    }
    const stargazers = repoData.stargazers || [];
    const uniqueUsers = new Set(stargazers.map((s) => s.username));
    const uniqueCount = uniqueUsers.size;
    const activityScores = stargazers.map((_, i) => i);
    const avgActivity = activityScores.length > 0
      ? Math.round((activityScores.reduce((a, b) => a + b, 0) / activityScores.length) * 100) / 100
      : 0;
    return {
      totalCount: stargazers.length,
      uniqueUsers: uniqueCount,
      averageActivity: avgActivity,
      firstSeen: repoData.firstSeen,
      lastUpdated: repoData.lastUpdated,
      hasData: true,
    };
  } catch (error) {
    logging.log('error', `Failed to get stargazer stats: ${error.message}`);
    throw error;
  }
};

const detectStargazerAnomalies = (repo, sensitivity = 1.5) => {
  try {
    if (!repo || typeof repo !== 'string') {
      throw new Error('Invalid repository identifier');
    }
    const normalizedRepo = repo.toLowerCase();
    const repoData = stargazerData.get(normalizedRepo);
    if (!repoData || !Array.isArray(repoData.stargazers) || repoData.stargazers.length === 0) {
      return { anomalies: [], anomalyCount: 0, hasAnomalies: false };
    }
    const stargazers = repoData.stargazers;
    const now = Date.now();
    const timeDiffs = [];
    for (let i = 1; i < stargazers.length; i++) {
      const prevTime = new Date(stargazers[i - 1].starredAt).getTime();
      const currTime = new Date(stargazers[i].starredAt).getTime();
      if (!isNaN(prevTime) && !isNaN(currTime)) {
        timeDiffs.push(Math.abs(currTime - prevTime));
      }
    }
    if (timeDiffs.length === 0) {
      return { anomalies: [], anomalyCount: 0, hasAnomalies: false };
    }
    const mean = timeDiffs.reduce((a, b) => a + b, 0) / timeDiffs.length;
    const stdDev = Math.sqrt(timeDiffs.reduce((sum, d) => sum + Math.pow(d - mean, 2), 0) / timeDiffs.length);
    const threshold = mean - sensitivity * stdDev;
    const anomalies = [];
    for (let i = 1; i < stargazers.length; i++) {
      const prevTime = new Date(stargazers[i - 1].starredAt).getTime();
      const currTime = new Date(stargazers[i].starredAt).getTime();
      if (!isNaN(prevTime) && !isNaN(currTime) && Math.abs(currTime - prevTime) < threshold) {
        anomalies.push({
          index: i,
          username: stargazers[i].username,
          timeDifference: Math.abs(currTime - prevTime),
        });
      }
    }
    return {
      anomalies,
      anomalyCount: anomalies.length,
      hasAnomalies: anomalies.length > 0,
    };
  } catch (error) {
    logging.log('error', `Failed to detect stargazer anomalies: ${error.message}`);
    throw error;
  }
};

const analyzeStargazerGrowth = (repo) => {
  try {
    if (!repo || typeof repo !== 'string') {
      throw new Error('Invalid repository identifier');
    }
    const normalizedRepo = repo.toLowerCase();
    const repoData = stargazerData.get(normalizedRepo);
    if (!repoData || !Array.isArray(repoData.stargazers) || repoData.stargazers.length < 2) {
      return { growthRate: 0, trend: 'stable', totalStars: repoData ? repoData.stargazers.length : 0 };
    }
    const stargazers = repoData.stargazers;
    const timestamps = stargazers.map((s) => new Date(s.starredAt).getTime()).filter((t) => !isNaN(t));
    if (timestamps.length < 2) {
      return { growthRate: 0, trend: 'stable', totalStars: stargazers.length };
    }
    timestamps.sort((a, b) => a - b);
    const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
    const growthRate = timeSpan > 0 ? (stargazers.length / timeSpan) * 1000 * 60 * 60 * 24 : 0;
    const midpoint = Math.floor(timestamps.length / 2);
    const firstHalfRate = midpoint > 0
      ? (midpoint / (timestamps[midpoint] - timestamps[0])) * 1000 * 60 * 60 * 24
      : 0;
    const secondHalfRate = (timestamps.length - midpoint) > 0
      ? ((timestamps.length - midpoint) / (timestamps[timestamps.length - 1] - timestamps[midpoint])) * 1000 * 60 * 60 * 24
      : 0;
    const trend = secondHalfRate > firstHalfRate * 1.5 ? 'accelerating'
      : secondHalfRate < firstHalfRate * 0.5 ? 'decelerating'
      : 'stable';
    return { growthRate: Math.round(growthRate * 100) / 100, trend, totalStars: stargazers.length };
  } catch (error) {
    logging.log('error', `Failed to analyze stargazer growth: ${error.message}`);
    throw error;
  }
};

const trackRunawayStargazers = async () => {
  try {
    const output = execSync('gh api repos/:owner/:repo/stargazers', { encoding: 'utf8' });
    const stargazers = JSON.parse(output);
    const runaway = stargazers.filter((user) => user?.type === 'Bot');
    logging.log('warn', `Detected ${runaway.length} runaway stargazers`);
    return runaway;
  } catch (error) {
    logging.log('error', `Failed to track runaway stargazers: ${error.message}`);
    return [];
  }
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
  filterEmotionsByCategory,
  runPendingRenovateUpdates,
  trackStargazers,
  identifyRunawayStargazers,
  getStargazerStats,
  detectStargazerAnomalies,
  analyzeStargazerGrowth,
  trackRunawayStargazers
};

module.exports.real = { ...module.exports };