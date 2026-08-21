/**
 * Main entry point for dependency dashboard handling
 * Handles Renovate dependency update parsing and management
 */

const DEFAULT_OPTIONS = {
  includeDevDependencies: true,
  includePeerDependencies: true,
  includeOptionalDependencies: true
};

/**
 * Parse Renovate issue body to extract dependency updates
 * @param {string} issueBody - The GitHub issue body content
 * @returns {Object} Parsed dependency information
 */
function parseDependencyIssue(issueBody) {
  if (!issueBody || typeof issueBody !== 'string') {
    return {
      awaitingSchedule: [],
      blocked: [],
      detected: {},
      errors: []
    };
  }

  return {
    awaitingSchedule: extractAwaitingSchedule(issueBody),
    blocked: extractBlocked(issueBody),
    detected: extractDetectedDependencies(issueBody),
    errors: extractErrors(issueBody)
  };
}

/**
 * Extract dependencies awaiting schedule from issue body
 * @param {string} body - Issue body text
 * @returns {Array} List of awaiting dependencies
 */
function extractAwaitingSchedule(body) {
  const awaitingSection = body.match(/## Awaiting Schedule[\s\S]*?(?=##|$)/gi);
  if (!awaitingSection) return [];

  const deps = [];
  const regex = /\[ \]<!-- .* -->(?:chore|fix|feat)\([^)]+\): update (?:dependency |action )?([^\s]+) (?:to|action to) (v?\d+[\d.]*)/gi;
  const sectionContent = awaitingSection[0];
  let match;

  while ((match = regex.exec(sectionContent)) !== null) {
    deps.push({
      package: match[1],
      version: match[2],
      type: 'awaiting'
    });
  }

  return deps;
}

/**
 * Extract blocked PRs from issue body
 * @param {string} body - Issue body text
 * @returns {Array} List of blocked updates
 */
function extractBlocked(body) {
  const blockedSection = body.match(/## PR Closed \(Blocked\)[\s\S]*?(?=##|$)/gi);
  if (!blockedSection) return [];

  const blocked = [];
  const regex = /\[ \]<!-- .* -->(?:chore|fix|feat)\([^)]+\): update [^\s]+/gi;
  const sectionContent = blockedSection[0];
  let match;

  while ((match = regex.exec(sectionContent)) !== null) {
    blocked.push({
      update: match[0],
      type: 'blocked'
    });
  }

  return blocked;
}

/**
 * Extract detected dependencies by ecosystem
 * @param {string} body - Issue body text
 * @returns {Object} Dependencies grouped by ecosystem
 */
function extractDetectedDependencies(body) {
  const detected = {
    npm: [],
    github: [],
    circleci: [],
    gitlabci: [],
    travis: []
  };

  const ecosystems = ['npm', 'github-actions', 'circleci', 'gitlabci', 'travis'];
  
  ecosystems.forEach(ecosystem => {
    const section = body.match(new RegExp(`<summary>${ecosystem}[^<]*</summary>[\\s\\S]*?(?=<summary>|</details>|##|$)`, 'gi'));
    if (section && section[0]) {
      const pkgs = section[0].match(/`([^`]+)`/g) || [];
      detected[ecosystem === 'github-actions' ? 'github' : ecosystem] = pkgs.map(p => p.replace(/`/g, ''));
    }
  });

  return detected;
}

/**
 * Extract repository errors/warnings
 * @param {string} body - Issue body text
 * @returns {Array} List of errors
 */
function extractErrors(body) {
  const errors = [];
  const errorSection = body.match(/## Repository Problems[\s\S]*?(?=## Awaiting|$)/gi);
  if (errorSection && errorSection[0]) {
    const warns = errorSection[0].match(/⚠️\s*(.*)/gi) || [];
    warns.forEach(w => {
      errors.push({
        type: 'warning',
        message: w.replace('⚠️ ', '')
      });
    });
  }

  return errors;
}

/**
 * Format dependency updates for display
 * @param {Object} parsed - Parsed dependency data
 * @returns {string} Formatted output
 */
function formatDependencyUpdates(parsed) {
  const lines = ['## Dependency Update Summary', ''];

  if (parsed.awaitingSchedule.length > 0) {
    lines.push(`### Awaiting Schedule (${parsed.awaitingSchedule.length})`);
    parsed.awaitingSchedule.forEach(dep => {
      lines.push(`- ${dep.package} → ${dep.version}`);
    });
    lines.push('');
  }

  if (parsed.blocked.length > 0) {
    lines.push(`### Blocked (${parsed.blocked.length})`);
    parsed.blocked.forEach(b => {
      lines.push(`- ${b.update}`);
    });
    lines.push('');
  }

  Object.entries(parsed.detected).forEach(([ecosystem, deps]) => {
    if (deps.length > 0) {
      lines.push(`### ${ecosystem} (${deps.length})`);
      deps.forEach(dep => {
        lines.push(`- ${dep}`);
      });
      lines.push('');
    }
  });

  return lines.join('\n');
}

/**
 * Create a summary report from issue body
 * @param {string} issueBody - GitHub issue body
 * @param {Object} options - Configuration options
 * @returns {Object} Summary report
 */
function createDependencyReport(issueBody, options = DEFAULT_OPTIONS) {
  const parsed = parseDependencyIssue(issueBody);
  
  const filteredAwaiting = parsed.awaitingSchedule.filter(dep => {
    if (options.filterByType) {
      return true;
    }
    return true;
  });

  return {
    summary: {
      totalAwaiting: filteredAwaiting.length,
      totalBlocked: parsed.blocked.length,
      totalEcosystems: Object.values(parsed.detected).filter(d => d.length > 0).length
    },
    awaitingSchedule: filteredAwaiting,
    blocked: parsed.blocked,
    detected: parsed.detected,
    formatted: formatDependencyUpdates({ ...parsed, awaitingSchedule: filteredAwaiting })
  };
}

module.exports = {
  parseDependencyIssue,
  extractAwaitingSchedule,
  extractBlocked,
  extractDetectedDependencies,
  extractErrors,
  formatDependencyUpdates,
  createDependencyReport,
  DEFAULT_OPTIONS
};