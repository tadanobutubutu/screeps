"use strict";
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
let isLintingRunning = false;
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

// Add utility functions from origin/main
const isSuperFunction = (fn) => {
  if (typeof fn !== 'function') return false;
  return fn.name && fn.name.toLowerCase().includes('super');
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min = 0, max = 1) => {
  return Math.random() * (max - min) + min;
};

const getRandomItem = (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return undefined;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

const shuffleArray = (arr) => {
  if (!Array.isArray(arr)) return [];
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Add new export for running pending renovate updates
const runPendingRenovateUpdates = async () => {
  logging.log('info', 'Running pending renovate updates');
  await updateTypeScript();
  await updatePosthogJsToLatest();
  await updateStaleAction();
  await updateLinearBotsGitstream();
  await updateLinearBotsGitstreamGithubAction();
  await updateCodeqlAction();
  return { success: true, updated: ['typescript', 'posthog-js', 'actions/stale', 'linear-bots/gitstream-github-action', 'github/codeql-action'] };
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
  updatePosthogJsToLatest,
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
  trackRunawayStargazers,
  runLinting,
  fixLintingIssues,
  isSuperFunction,
  getRandomInt,
  getRandomFloat,
  getRandomItem,
  shuffleArray
};

module.exports.real = { ...module.exports };