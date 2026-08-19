/**
 * Dependency Dashboard - Main Entry Point
 * Handles dependency update tracking and reporting
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

class DependencyDashboard {
  constructor() {
    this.dependencies = new Map();
    this.renovateConfig = null;
  }

  /**
   * Load dependencies from package.json
   * @returns {Object} Parsed package.json content
   */
  loadPackageJson() {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found');
    }
    const content = fs.readFileSync(packageJsonPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Parse Renovate configuration
   * @returns {Object} Renovate config object
   */
  loadRenovateConfig() {
    const configPath = path.join(process.cwd(), 'renovate.json');
    if (!fs.existsSync(configPath)) {
      return {};
    }
    const content = fs.readFileSync(configPath, 'utf-8');
    return JSON.parse(content);
  }

  /**
   * Extract dependency information from package.json
   * @param {Object} packageJson - Parsed package.json
   * @returns {Object} Categorized dependencies
   */
  extractDependencies(packageJson) {
    return {
      dependencies: packageJson.dependencies || {},
      devDependencies: packageJson.devDependencies || {},
      peerDependencies: packageJson.peerDependencies || {},
      optionalDependencies: packageJson.optionalDependencies || {}
    };
  }

  /**
   * Check for available updates for a specific dependency
   * @param {string} name - Package name
   * @param {string} currentVersion - Current version
   * @returns {Promise<Object|null>} Update info or null
   */
  async checkUpdate(name, currentVersion) {
    try {
      const response = await axios.get(
        `https://registry.npmjs.org/${name}/latest`
      );
      const latestVersion = response.data.version;
      
      if (this.compareVersions(currentVersion, latestVersion) < 0) {
        return {
          name,
          currentVersion,
          latestVersion,
          updateAvailable: true
        };
      }
      return null;
    } catch (error) {
      console.error(`Failed to check update for ${name}:`, error.message);
      return null;
    }
  }

  /**
   * Compare semantic versions
   * @param {string} v1 - First version
   * @param {string} v2 - Second version
   * @returns {number} -1 if v1 < v2, 0 if equal, 1 if v1 > v2
   */
  compareVersions(v1, v2) {
    const parseVersion = (v) => {
      return v.replace(/[^0-9.]/g, '').split('.').map(n => parseInt(n, 10) || 0);
    };
    
    const parts1 = parseVersion(v1);
    const parts2 = parseVersion(v2);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const p1 = parts1[i] || 0;
      const p2 = parts2[i] || 0;
      
      if (p1 < p2) return -1;
      if (p1 > p2) return 1;
    }
    
    return 0;
  }

  /**
   * Generate dashboard report
   * @returns {Object} Dashboard data
   */
  generateReport() {
    const packageJson = this.loadPackageJson();
    const deps = this.extractDependencies(packageJson);
    
    const allDeps = {
      ...deps.dependencies,
      ...deps.devDependencies
    };

    const pendingUpdates = [];
    
    for (const [name, version] of Object.entries(allDeps)) {
      pendingUpdates.push({
        name,
        currentVersion: version,
        type: deps.dependencies[name] ? 'production' : 'development'
      });
    }

    return {
      timestamp: new Date().toISOString(),
      packageName: packageJson.name,
      totalDependencies: Object.keys(allDeps).length,
      pendingUpdates,
      awaitingSchedule: this.getAwaitingScheduleUpdates()
    };
  }

  /**
   * Get updates awaiting schedule
   * @returns {Array} List of awaiting schedule updates
   */
  getAwaitingScheduleUpdates() {
    // Placeholder for schedule-based update tracking
    return [
      'chore(deps): update google/osv-scanner-action action to v2.5.1',
      'chore(deps): update dependency eslint to v10',
      'chore(deps): update dependency typescript to v7',
      'chore(deps): update jest monorepo to v30 (babel-jest, jest)',
      'fix(deps): update dependency react to v19'
    ];
  }

  /**
   * Format report as markdown
   * @param {Object} report - Dashboard report
   * @returns {string} Markdown formatted report
   */
  formatMarkdownReport(report) {
    let markdown = `# Dependency Dashboard\n\n`;
    markdown += `**Last Updated:** ${report.timestamp}\n\n`;
    markdown += `**Package:** ${report.packageName}\n\n`;
    markdown += `**Total Dependencies:** ${report.totalDependencies}\n\n`;
    
    markdown += `## Awaiting Schedule\n\n`;
    markdown += `The following updates are awaiting their schedule:\n\n`;
    
    report.awaitingSchedule.forEach(update => {
      markdown += `- [ ] ${update}\n`;
    });
    
    markdown += `\n## Pending Updates\n\n`;
    report.pendingUpdates.forEach(dep => {
      markdown += `- **${dep.name}** (${dep.type}): ${dep.currentVersion}\n`;
    });
    
    return markdown;
  }

  /**
   * Main execution function
   */
  async main() {
    try {
      const report = this.generateReport();
      const markdown = this.formatMarkdownReport(report);
      
      console.log(markdown);
      
      // Write report to file if needed
      const reportPath = path.join(process.cwd(), 'dependency-dashboard.md');
      fs.writeFileSync(reportPath, markdown);
      
      return report;
    } catch (error) {
      console.error('Error generating dashboard:', error);
      throw error;
    }
  }
}

// Export for testing
module.exports = DependencyDashboard;

// Run if executed directly
if (require.main === module) {
  const dashboard = new DependencyDashboard();
  dashboard.main().catch(console.error);
}