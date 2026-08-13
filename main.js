// main.js
const { getActiveBranches } = require('./src/branches');
const { getOpenPRs } = require('./src/pulls');
const { getRepoStats } = require('./src/stats');
const { getDependencyUpdates } = require('./src/dependencies');

/**
 * Main function to generate the dependency dashboard
 * @returns {Promise<Object>} Dashboard data
 */
async function generateDashboard() {
  try {
    const [branches, prs, stats, updates] = await Promise.all([
      getActiveBranches(),
      getOpenPRs(),
      getRepoStats(),
      getDependencyUpdates()
    ]);

    return {
      branches,
      prs,
      stats,
      updates,
      warnings: [
        "Updating multiple npm lock files is deprecated and support will be removed in future versions."
      ]
    };
  } catch (error) {
    console.error('Error generating dashboard:', error);
    throw error;
  }
}

/**
 * Get all dependency updates awaiting schedule
 * @returns {Promise<Array>} List of awaiting updates
 */
async function getAwaitingUpdates() {
  try {
    const updates = await getDependencyUpdates();
    return updates.filter(update => update.status === 'awaiting-schedule');
  } catch (error) {
    console.error('Error getting awaiting updates:', error);
    throw error;
  }
}

/**
 * Get all blocked PRs
 * @returns {Promise<Array>} List of blocked PRs
 */
async function getBlockedPRs() {
  try {
    const prs = await getOpenPRs();
    return prs.filter(pr => pr.status === 'blocked');
  } catch (error) {
    console.error('Error getting blocked PRs:', error);
    throw error;
  }
}

/**
 * Get all pending updates
 * @returns {Promise<Array>} List of pending updates
 */
async function getPendingUpdates() {
  try {
    const updates = await getDependencyUpdates();
    return updates.filter(update => update.status === 'pending');
  } catch (error) {
    console.error('Error getting pending updates:', error);
    throw error;
  }
}

/**
 * Get all closed PRs that could be recreated
 * @returns {Promise<Array>} List of closed PRs
 */
async function getClosedPRs() {
  try {
    const prs = await getOpenPRs();
    return prs.filter(pr => pr.status === 'closed');
  } catch (error) {
    console.error('Error getting closed PRs:', error);
    throw error;
  }
}

// Export all functions
module.exports = {
  generateDashboard,
  getAwaitingUpdates,
  getBlockedPRs,
  getPendingUpdates,
  getClosedPRs
};