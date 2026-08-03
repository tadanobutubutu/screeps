// deploy.js

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROJECT_ROOT = path.resolve(__dirname);

function log(message) {
  console.log(`[Deploy] ${message}`);
}

function error(message) {
  console.error(`[Deploy Error] ${message}`);
}

function deploy() {
  try {
    log('Starting deployment...');
    
    // Check if build directory exists
    const buildPath = path.join(PROJECT_ROOT, 'build');
    if (!fs.existsSync(buildPath)) {
      throw new Error('Build directory not found. Run build first.');
    }
    
    log('Deployment complete!');
  } catch (err) {
    error(err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  deploy();
}

module.exports = { deploy, log, error };