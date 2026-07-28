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
            console[level]?.call?.console