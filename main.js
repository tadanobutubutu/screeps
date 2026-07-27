async function updateGitstreamGithubAction() {
    try {
        const taskId = await createAsyncUpdateTask('update gitstream-github-action action to v4');
        await npmUpdate('linear-bots/gitstream-github-action', 'latest');
        logging.log('info', 'Successfully updated linear-bots/gitstream-github-action');
        return taskId;
    } catch (error) {
        logging.log('error', `Failed to update linearbots/gitstream: ${error.message}`);
        throw error;
    }
}

async function updatePosthogJs() {
    await npmUpdate('posthog-js', '1.407.2');
    logging.log('info', 'Successfully updated posthog-js to v1.407.2');
}

module.exports = {
  logging,
  addTask,
  getTaskById,
  npmUpdate,
  updateDependencyVersions,
  updateNpmPackage,
  createAsyncUpdateTask,
  updateActionsLabeler,
  updateGitstreamGithubAction,
  updateLinearBotsGitstream,
  visualizeMemory,
  updatePosthogJs,
  autonomousEfficiencyRole,
  handleImageSearchPRs,
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateLinearBotsGitstreamGithubAction
};