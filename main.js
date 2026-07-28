const { updateDependencyVersions } = require('./updateDependencyVersions');

const npmUpdate = async (packageName, version = 'latest') => {
  try {
    execSync(`npm install ${packageName}@${version}`, { stdio: 'inherit' });
    logging.log('info', `Updated ${packageName} to ${version}`);
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

const runPendingRenovateUpdates = async () => {
  // List of Renovate-scheduled updates that have corresponding functions above
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

// Integrate both NAME parameters into a combined function parameter
const updateNpmPackage = async (packageName, version) => {
  try {
    const taskId = await createAsyncUpdateTask(`update ${packageName} to ${version}`);
    await npmUpdate(packageName, version);
    logging.log('info', `Successfully updated ${packageName} to ${version}`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update ${packageName}: ${error.message}`);
    throw error;
  }
};

// Merge area resolution: Remove duplicate updateFuncions()
const updateLinearBotsGitstreamGithubAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream-github-action to v4');
    await updateNpmPackage('linear-bots/gitstream-github-action', 'v4');
    logging.log('info', `Successfully updated linear-bots/gitstream-github-action to v4`);
    return taskId;
  } catch (error) {
    logging.log('warn', `Failed to update linear-bots/gitstream-github-action: ${error.message}`);
    // Do not re-throw – Renovate will handle the failure gracefully
  }
};

// Remove duplicate update function (origin)
const updateLinearBotsGitstream = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update linear-bots/gitstream to latest');
    await updateNpmPackage('linear-bots/gitstream', 'latest');
    logging.log('info', `Successfully updated linear-bots/gitstream to latest`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update linear-bots/gitstream: ${error.message}`);
    throw error;
  }
}; // Merged conflict resolution ends