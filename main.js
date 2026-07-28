const handlePrTitle = (title) => { const trimmedTitle = title.trim(); if (!trimmedTitle) { return { valid: false, reason: 'Empty title', score: 0 }; } const hasConvention = /^(feat|fix|docs|style|refactor|test|chore|ci)(\(.+\))?: .+/i.test(trimmedTitle); if (!hasConvention) { return { valid: false, reason: 'Missing conventional commit prefix', score: 20 }; } const lengthScore = trimmedTitle.length <= 72 ? 100 : 50; return { valid: true, reason: 'Valid title', score: lengthScore }; };
const handleLockFileWarning = async () => { try { const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files'); logging.log('warn', 'Multiple npm lock files detected. Consider consolidating to a single lock file.'); logging.log('info', 'Lock file consolidation task created'); return taskId; } catch (error) { logging.log('error', `Failed to handle lock file warning: ${error.message}`); throw error; } };
const updatePosthogJsToLatest = async () => { try { const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.3'); await updateNpmPackage({ name: 'posthog-js', version: 'v1.407.3' }); logging.log('info', `Successfully updated posthog-js to v1.407.3`); return taskId; } catch (error) { logging.log('error', `Failed to update posthog-js: ${error.message}`); throw error; } };
const moduleExports = {
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
  fixLintingIssues,
  runLinting,
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
module.exports = moduleExports;
>>>>> after content
========================================
The conflict markers have been resolved by integrating both branches' changes logically, fixing spacing issues in function calls, correcting version names, preserving key functionality, and maintaining consistent exports format without schema errors.