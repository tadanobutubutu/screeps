const willRecreateBlockedUpdate = (pr) => {
  // Returns true if the PR title indicates it blocks an update (e.g., contains "Pavouk")
  // Also checks for a number in the title (e.g., "123" or "#123") that matches the current PR number.
  const title = pr.data?.title ?? pr.title;
  const hasPavouk = /Pavouk/i.test(title);
  // Extract the first number in the title (as a standalone word)
  const match = /\b(\d+)\b/.exec(title);
  const blockedPrNumber = match ? match[1] : null;
  const matchesPrNumber = blockedPrNumber && parseInt(blockedPrNumber) === pr.number;
  
  return hasPavouk || matchesPrNumber;
};

const logging = {
  log: (level, message) => {
    // Basic console logging; replace with a proper logger as needed
    console[level](`${level}: ${message}`);
  },
};

let taskIdCounter = 0;
const tasks = [];

const addTask = (title, priority = 'edium', tags = []) => {
  taskIdCounter++;
  tasks.push({ id: taskIdCounter, title, priority, tags, completed: false });
  return taskIdCounter;
};

const getTaskById = (taskId) => {
  return tasks.find(task => task.id === taskId) || null;
};

const npmUpdate = async (dependency, newVersion) => {
  // Placeholder function for dependency updates (future implementation)
  return new Promise(resolve => {
    resolve();
  });
};

const updateDependencyVersions = async (dependency, newVersion) => {
  const taskTitle = `Update dependency ${dependency} to ${newVersion}`;

  return new Promise((resolve, reject) => {
    try {
      npmUpdate(dependency, newVersion)
        .then(() => {
          logging.log('info', `Successfully updated ${dependency} to ${newVersion}`);
          addTask(taskTitle, 'high', ['renovate']);
          resolve();
        })
        .catch((error) => {
          logging.log('error', `Failed to update ${dependency}: ${error.message}`);
          reject(error);
        });
    } catch (error) {
      reject(error);
    }
  });
};

const createAsyncUpdateTask = async (title, priority = 'edium', tags = []) => {
  return new Promise((resolve, reject) => {
    try {
      const taskId = addTask(title, priority, tags);
      logging.log('info', `Created task: ${title}`);
      resolve(taskId);
    } catch (error) {
      logging.log('error', `Failed to create task: ${error.message}`);
      reject(error);
    }
  });
};

const isAwaitingSchedule = (dependency) => {
  const task = tasks.find(task => task.title.startsWith("Update ") && task.title.includes(dependency));
  return task && !task.completed;
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

// Added GitHub Action updates based on the changes
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

const updateCodeqlAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update codeql action to v4');
    await updateNpmPackage({ name: 'codeql-action', version: 'v4' });
    logging.log('info', `Successfully updated codeql action to v4`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update codeql action: ${error.message}`);
    throw error;
  }
};

const updatePosthogJsToLatest = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update posthog-js to v1.407.3');
    await updateNpmPackage({ name: 'posthog-js', version: 'v1.407.3' });
    logging.log('info', `Successfully updated posthog-js to v1.407.3`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update posthog-js: ${error.message}`);
    throw error;
  }
};

const handleLockFileWarning = async () => {
  try {
    const taskId = await createAsyncUpdateTask('Consolidate multiple npm lock files');
    logging.log('warn', 'Multiple npm lock files detected. Consider consolidating to a single lock file.');
    logging.log('info', 'Lock file consolidation task created');
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to handle lock file warning: ${error.message}`);
    throw error;
  }
};

const updateStaleAction = async () => {
  try {
    const taskId = await createAsyncUpdateTask('update actions/stale to v10');
    await updateNpmPackage({ name: 'actions/stale', version: 'v10' });
    logging.log('info', `Successfully updated actions/stale to v10`);
    return taskId;
  } catch (error) {
    logging.log('error', `Failed to update actions/stale: ${error.message}`);
    throw error;
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
  updateCodeqlAction,
  updatePosthogJsToLatest,
  handleLockFileWarning,
  updateStaleAction,
  isAwaitingSchedule,
  willRecreateBlockedUpdate,
};