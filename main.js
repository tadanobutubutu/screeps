'use strict';

/* deploy.js – Deployment helper utilities
 *
 * This module provides helper functions for querying package versions
 * and environment configuration. It is intentionally minimal to avoid
 * extra dependencies, while still offering useful functionality for
 * the Screeps bot repository.
 *
 * The module functions are:
 *
 *   - getPostHogVersion
 *   - getSupabaseVersion
 *   - getCircleCINodeVersion
 *   - getDevContainerPythonVersion
 *   - getDevContainerNodeVersion
 *   - getTravisNodeVersion
 *   - getRenovateUpdates
 *   - getSentryVersion
 *   - getGitHubActionsPythonVersion
 *   - getGitHubActionsNodeVersion
 *   - getGitHubActionsSetupNodeVersion
 *   - getGitHubActionsUploadArtifactVersion
 *   - getGitHubActionsSetupPythonVersion
 *   - getGitHubActionsCodeQLVersion
 *   - getGitHubActionsPnpmVersion
 *   - getGitHubActionsGitStreamVersion
 *   - getTestFiles
 *   - getGitHubActionsSetupNodeUpdate
 *   - getGitHubActionsUploadArtifactUpdate
 *   - getNodeMajorVersionUpdate
 *   - getGitHubActionsSetupPythonUpdate
 *   - getTypeScriptVersionUpdate
 *   - getPnpmActionSetupUpdate
 *   - getPostHogVersionUpdate
 *   - getGitHubActionsCodeQLUpdate
 *   - getGitHubActionsPnpmUpdate
 *   - getGitHubActionsGitStreamUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *   - getGitHubActionsSetupNodeVersionUpdate
 *   - getGitHubActionsUploadArtifactVersionUpdate
 *   - getGitHubActionsSetupPythonVersionUpdate
 *   - getGitHubActionsCodeQLVersionUpdate
 *   - getGitHubActionsPnpmVersionUpdate
 *   - getGitHubActionsGitStreamVersionUpdate
 *
 * The exported functions are also
 */

const fs = require('fs');
const path = require('path');

function getPostHogVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['posthog-js'] || null;
}

function getSupabaseVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['@supabase/supabase-js'] || null;
}

function getCircleCINodeVersion() {
  const configPath = path.join(__dirname, '..', '.circleci', 'config.yml');
  const config = fs.readFileSync(configPath, 'utf8');
  const match = config.match(/cimg\/node (\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getDevContainerPythonVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.features?.python?.version || null;
}

function getDevContainerNodeVersion() {
  const configPath = path.join(__dirname, '..', '.devcontainer', 'devcontainer.json');
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  return config.features?.node?.version || null;
}

function getTravisNodeVersion() {
  const travisPath = path.join(__dirname, '..', '.travis.yml');
  const config = fs.readFileSync(travisPath, 'utf8');
  const match = config.match(/node_js:\s*\[(.*?)\]/i);
  if (!match) return null;
  const versions = match[1]
    .split(',')
    .map(v => v.trim().replace(/['"`]/g, ''))
    .filter(Boolean);
  return versions.length ? versions[0] : null;
}

function getRenovateUpdates() {
  const renovatePath = path.join(__dirname, '..', 'renovate.json');
  if (!fs.existsSync(renovatePath)) return null;
  const data = JSON.parse(fs.readFileSync(renovatePath, 'utf8'));
  return data.updates || null;
}

function getSentryVersion() {
  const packageJson = require('../package.json');
  return packageJson.dependencies['@sentry/node'] || null;
}

function getGitHubActionsPythonVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: actions\/setup-python@v\d+/i);
  if (!match) return null;
  const pyMatch = config.match(/python-version: ('|\")?([:.0-9a-zA-Z-_]+)('|\")?/i);
  return pyMatch ? pyMatch[2] : null;
}

function getGitHubActionsNodeVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: actions\/setup-node@v\d+/i);
  if (!match) return null;
  const nodeMatch = config.match(/node-version: ('|\")?([:.0-9a-zA-Z-_]+)('|\")?/i);
  return nodeMatch ? nodeMatch[2] : null;
}

function getGitHubActionsSetupNodeVersion() {
  const dist = path.join(__dirname, '..', 'dist', 'setup-node.js');
  if (!fs.existsSync(dist)) return null;
  const content = fs.readFileSync(dist, 'utf8');
  const match = content.match(/process\.env\.NODE_VERSION = '([^']+)';/);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: actions\/upload-artifact@v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: actions\/setup-python@v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsCodeQLVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: github\/codeql-action@v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsPnpmVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: pnpm\/action-setup@v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsGitStreamVersion() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'gitstream.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/uses: linear-bots\/gitstream-github-action@v(\d+)/i);
  return match ? match[1] : null;
}

function getTestFiles() {
  const testDir = path.join(__dirname, '..', 'tests');
  if (!fs.existsSync(testDir)) return [];
  return fs.readdirSync(testDir).filter(file => file.endsWith('.test.js'));
}

function getGitHubActionsSetupNodeUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-node v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/upload-artifact v(\d+)/i);
  return match ? match[1] : null;
}

function getNodeMajorVersionUpdate() {
  const packageJson = require('../package.json');
  const engines = packageJson.engines || {};
  const nodeVersion = engines.node || null;
  if (!nodeVersion) return null;
  const match = nodeVersion.match(/^(\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-python v(\d+)/i);
  return match ? match[1] : null;
}

function getTypeScriptVersionUpdate() {
  const packageJson = require('../package.json');
  const devDeps = packageJson.devDependencies || {};
  const tsVersion = devDeps.typescript || null;
  if (!tsVersion) return null;
  const match = tsVersion.match(/^(\d+)/);
  return match ? match[1] : null;
}

function getPnpmActionSetupUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/pnpm\/action-setup v(\d+)/i);
  return match ? match[1] : null;
}

function getPostHogVersionUpdate() {
  const packageJson = require('../package.json');
  const deps = packageJson.dependencies || {};
  const postHogVersion = deps['posthog-js'] || null;
  if (!postHogVersion) return null;
  const match = postHogVersion.match(/^(\d+\.\d+\.\d+)/);
  return match ? match[1] : null;
}

function getGitHubActionsCodeQLUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/github\/codeql-action v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsPnpmUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/pnpm\/action-setup v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsGitStreamUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'gitstream.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/linear-bots\/gitstream-github-action v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsSetupNodeVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-node v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/upload-artifact v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-python v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsCodeQLVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/github\/codeql-action v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsPnpmVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/pnpm\/action-setup v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsGitStreamVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'gitstream.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/linear-bots\/gitstream-github-action v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsSetupNodeVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-node v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsUploadArtifactVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/upload-artifact v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsSetupPythonVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/actions\/setup-python v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsCodeQLVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/github\/codeql-action v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsPnpmVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'ci.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/pnpm\/action-setup v(\d+)/i);
  return match ? match[1] : null;
}

function getGitHubActionsGitStreamVersionUpdate() {
  const workflow = path.join(__dirname, '..', '.github', 'workflows', 'gitstream.yml');
  if (!fs.existsSync(workflow)) return null;
  const config = fs.readFileSync(workflow, 'utf8');
  const match = config.match(/linear-bots\/gitstream-github-action v(\d+)/i);
  return match ? match[1] : null;
}