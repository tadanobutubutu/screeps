const { execFileSync } = require('child_process')

const isValidMetric = (value) => Number.isSafeInteger(value) && value >= 0

const metricBadge = (label, value, color, target) => {
  if (!isValidMetric(value)) return null
  const encodedLabel = encodeURIComponent(label)
  return `[![${label}](https://img.shields.io/badge/${encodedLabel}-${value}-${color})](${target})`
}

const getGitHubRepositorySlug = (rootDir) => {
  try {
    const remoteUrl = execFileSync('git', ['-C', rootDir, 'config', '--get', 'remote.origin.url'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    const match = remoteUrl.match(
      /^(?:https?:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/|git:\/\/github\.com\/)([^/?#]+\/[^/?#]+?)(?:\.git)?\/?$/i
    )
    if (!match || !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(match[1])) return null
    return match[1]
  } catch {
    return null
  }
}

const hasVerifiedMitLicense = (packageJsonText, licenseText) => {
  try {
    const packageJson = JSON.parse(packageJsonText)
    const licenseHeader = licenseText
      .replace(/^\uFEFF/, '')
      .split(/\r\n|\r|\n/)
      .find((line) => line.trim().length > 0)
      ?.trim()
    return packageJson.license === 'MIT' && licenseHeader === 'MIT License'
  } catch {
    return false
  }
}

const createBadgeBlock = ({ rootDir, workflowFiles, roleFiles, totalLines, packageJsonText, licenseText }) => {
  const badges = []
  const githubSlug = getGitHubRepositorySlug(rootDir)
  const ciWorkflow = Array.isArray(workflowFiles)
    ? workflowFiles.find(({ file }) => file === 'ci.yml' || file === 'ci.yaml')
    : null

  if (ciWorkflow && githubSlug) {
    badges.push(
      `[![CI](https://github.com/${githubSlug}/actions/workflows/${ciWorkflow.file}/badge.svg)](https://github.com/${githubSlug}/actions/workflows/${ciWorkflow.file})`
    )
  }

  const workflowBadge = metricBadge('Workflow files', workflowFiles?.length, 'green', './.github/workflows')
  const rolesBadge = metricBadge(
    'Role files',
    roleFiles?.length,
    'orange',
    `#-ロールファイル-${roleFiles?.length}個`
  )
  const linesBadge = metricBadge('Root JS lines', totalLines, 'purple', '#-統計情報')

  if (workflowBadge) badges.push(workflowBadge)
  if (rolesBadge) badges.push(rolesBadge)
  if (linesBadge) badges.push(linesBadge)
  if (hasVerifiedMitLicense(packageJsonText, licenseText)) {
    badges.push('[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)')
  }

  return badges.join('\n')
}

module.exports = {
  createBadgeBlock,
  getGitHubRepositorySlug,
  hasVerifiedMitLicense,
  isValidMetric,
  metricBadge,
}
