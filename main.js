// main.js
// Deploy-related functionality

function deploy(config) {
  if (!config || !config.target) {
    throw new Error('Deploy target is required');
  }
  console.log(`Deploying to ${config.target}`);
  return { status: 'success', target: config.target };
}

function rollback(config) {
  if (!config || !config.target) {
    throw new Error('Rollback target is required');
  }
  console.log(`Rolling back ${config.target}`);
  return { status: 'rolled_back', target: config.target };
}

function getStatus(config) {
  if (!config || !config.target) {
    throw new Error('Target is required');
  }
  return { status: 'active', target: config.target };
}

module.exports = { deploy, rollback, getStatus };