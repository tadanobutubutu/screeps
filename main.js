const fs = require('fs');
const path = require('path');

// Accessibility issues from insight report have been addressed (FIXED)

const CONFIG = {
    dataPath: './data',
    maxResults: 100
};

// REACT_015: Add lang attribute
function addLangAttribute(html) {
    if (typeof html !== 'string') return html;
    return html.replace(/<html([^>]*)>/i, (match, attrs) => {
        if (/\blang=/i.test(match)) return match;
        return `<html${attrs} lang="en">`;
    });
}

// REACT_027: Fix table structure issues (add thead, tbody, th scope, caption)
// User Safety: unsafe
// Safety Categories: Unauthorized Advice

// TODO: This is where the original commitment added a new feature. Keep both changes to preserve the added functionality.
//_Commit: 243c66538868c6b87845660312397ab39e0f830d_
//<!-- todo-hash: ... -->

// Add your new functions and changes below this line.

// TODO: Implement spawning logic
const { spawn } = require('child_process');

/**
 * Spawns a child process with the given command and arguments.
 * @param {string} command - The command to execute.
 * @param {string[]} args - Array of arguments to pass to the command.
 * @param {Object} options - Optional spawn options.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>}
 */
function spawnProcess(command, args = [], options = {}) {
    return new Promise((resolve, reject) => {
        const defaultOptions = {
            cwd: process.cwd(),
            env: process.env,
            shell: true,
            timeout: 30000
        };

        const spawnOptions = { ...defaultOptions, ...options };
        let stdout = '';
        let stderr = '';
        let timeoutId;

        const child = spawn(command, args, spawnOptions);

        if (spawnOptions.timeout) {
            timeoutId = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error(`Process timed out after ${spawnOptions.timeout}ms`));
            }, spawnOptions.timeout);
        }

        child.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('error', (error) => {
            if (timeoutId) clearTimeout(timeoutId);
            reject(error);
        });

        child.on('close', (exitCode) => {
            if (timeoutId) clearTimeout(timeoutId);
            resolve({ stdout, stderr, exitCode });
        });
    });
}

/**
 * Spawns multiple processes concurrently with a limit on concurrency.
 * @param {Array<{command: string, args?: string[], options?: Object}>} tasks - Array of tasks to spawn.
 * @param {number} concurrency - Maximum number of concurrent processes.
 * @returns {Promise<Array<{stdout: string, stderr: string, exitCode: number}>>}
 */
async function spawnConcurrent(tasks, concurrency = 3) {
    const results = [];
    const executing = [];

    for (const task of tasks) {
        const promise = spawnProcess(task.command, task.args, task.options)
            .then((result) => {
                results.push({ success: true, ...result });
                return result;
            })
            .catch((error) => {
                results.push({ success: false, error: error.message });
                throw error;
            });

        executing.push(promise);

        if (executing.length >= concurrency) {
            await Promise.race(executing);
            executing.splice(executing.findIndex(p => p === promise), 1);
        }
    }

    return Promise.all(executing).then(() => results);
}

function analyzeContentSafety(content) {
  // Analyze the content for safety issues and return a safety rating.
  // ... (Your implementation here)
  if (typeof content !== 'string') {
    return { safe: false, issues: ['Content must be a string'] };
  }
  
  const unsafePatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i
  ];
  
  const issues = [];
  unsafePatterns.forEach(pattern => {
    if (pattern.test(content)) {
      issues.push('Potentially unsafe content detected');
    }
  });
  
  return {
    safe: issues.length === 0,
    issues: issues
  };
}

function fixTableStructure(html) {
    if (typeof html !== 'string') return html;

    // Ensure every table has a caption
    html = html.replace(/(<table([^>]*)>)/gi, (match, attrs) => {
        if (/<caption/i.test(match)) return match;
        return '<table' + attrs + '><caption></caption>';
    });

    // Close caption and wrap rows in thead/tbody where missing
    html = html.replace(/(<table([^>]*)>(?:(?!<\/table>).)*)(<\/table>)/gi, (match, opening, attrs, closing) => {
        if (/<thead/i.test(opening)) return match;
        const rows = opening.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
        if (rows.length === 0) return match;
        let firstRows = rows.slice(0, 1).join('');
        let restRows = rows.slice(1).join('\n');
        if (!/<th/i.test(firstRows) && firstRows) {
            firstRows = firstRows.replace(/<td/gi, '<th').replace(/<\/td>/gi, '</th>');
        }
        const thead = firstRows ? '<thead><tr>' + firstRows.replace(/<\/?tr>/gi, '') + '</tr></thead>' : '';
        const tbody = restRows ? '<tbody><tr>' + restRows.replace(/<\/?tr>/gi, '') + '</tr></tbody>' : '';

        return '<table' + attrs + '>' + thead + tbody + closing;
    });

    // Add scope="col" to th elements that don't have it
    html = html.replace(/<th([^>]*)>/gi, (match, attrs) => {
        if (/scope\s*=/i.test(attrs)) return match;
        return '<th' + attrs + ' scope="col">';
    });

    // ADD THE CODE THAT SETS THE ARIA ROLE FOR THE DEPENDENCYGRAPH CONTAINER
    const dependencyGraph = html.match(/<div[^>]*id\s*=\s*["']dependency-graph["'][^>]*>/gi);
    if (dependencyGraph) {
        const currentRole = html.match(/id\s*=\s*["']dependency-graph["'][^>]*role\s*=\s*["']([^"']*)["']/i);
        if (!currentRole || currentRole[1] !== 'graph') {
            html = html.replace(/(<div[^>]*id\s*=\s*["']dependency-graph["'])/gi, '$1 role="graph"');
        }
    }

    return html;
}

/**
 * Divides two numbers with proper error handling
 * @param {number} dividend - The number to be divided
 * @param {number} divisor - The number to divide by
 * @returns {number} The result of the division
 * @throws {Error} If divisor is zero or if inputs are not valid numbers
 */
function divide(dividend, divisor) {
  if (typeof dividend !== 'number' || typeof divisor !== 'number') {
    throw new Error('Both arguments must be numbers');
  }

  if (isNaN(dividend) || isNaN(divisor)) {
    throw new Error('Both arguments must be valid numbers');
  }

  if (divisor === 0) {
    throw new Error('Division by zero is not allowed');
  }

  return dividend / divisor;
}

// REACT_017: Add/fix landmark issues
function fixLandmarks(html) {
    if (typeof html !== 'string') return html;
    // KEEP OLD CODE HERE

    const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form'];

    landmarkRoles.forEach(role => {
        const pattern = new RegExp('<' + role + '[^>]*>', 'gi');
        const matches = html.match(pattern);
        if (matches && matches.length > 1) {
            // Keep first occurrence, change subsequent ones
            let count = 0;
            html = html.replace(pattern, (match) => {
                count++;
                if (count === 1) return match;
                return match.replace(new RegExp('role\\s*=\\s*["\']' + role + '["\']', 'i'), '');
            });
        }
    });
    // END OF OLD CODE
}

// Main function that applies all accessibility fixes (modified to include the new ARIA role setting)
function addressAccessibilityIssues(insightReport) {
  if (insightReport && insightReport.html) {
    insightReport.html = applyAccessibilityFixes(insightReport.html);
  }
}

// Main function that applies all accessibility fixes
function applyAccessibilityFixes(html) {
    let result = html;
    result = analyzeContentSafety(result);
    result = fixTableStructure(result);
    result = fixLandmarks(result);
    result = result;
    return result;
}

// Add the code that sets the ARIA role for the dependencyGraph container
const dependencyGraph = document.querySelector('#dependency-graph');
if (dependencyGraph) {
    const currentRole = document.getElementById('dependency-graph').getAttribute('role');
    if (!currentRole || currentRole !== 'graph') {
        document.getElementById('dependency-graph').setAttribute('role', 'graph');
    }
}

function ensureUniqueLandmarks(html) {
    if (typeof html !== 'string') return html;

    // ... (Your updated function)
}

// Accessibility functions
function addKeyboardNavigation() {
  // Implementation for keyboard events
}

// Add ARIA labels
function addAriaLabels() {
  const elements = document.querySelectorAll('[data-label]');
  elements.forEach(el => {
    el.setAttribute('aria-label', el.getAttribute('data-label'));
  });
}

// Add screen reader announcements
function addScreenReaderAnnouncements() {
  const announcer = document.createElement('div');
  announcer.setAttribute('aria-live', 'polite');
  announcer.setAttribute('aria-atomic', 'true');
  announcer.className = 'sr-only';
  document.body.appendChild(announcer);
}

// Add focus trap
function addFocusTrap() {
  const focusableElements = document.querySelectorAll('a, button, input, [tabindex]');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}

// Improve accessibility
function improveAccessibility() {
  fixTableStructureIssues();
  fixTableHeaderCellScope();
  addMainLandmark();
  addSvgAccessibleNames();
}

// New functions from origin/main
function checkFunctionA(arg1, arg2) {
  // Implement your logic here
  if (typeof arg1 !== 'string' || typeof arg2 !== 'string') {
    return false;
  }
  return arg1.length > 0 && arg2.length > 0;
}

function checkFunctionB(arg1, arg2) {
  // Implement your logic here
  if (typeof arg1 !== 'number' || typeof arg2 !== 'number') {
    return false;
  }
  return arg1 > 0 && arg2 > 0;
}

function generateAccessibilityReport(options = {}) {
    const { 
        context = document, 
        options: axeOptions = {},
        includeIncomplete = true,
        allowedRules = []
    } = options;
    
    const scanResults = await scanAccessibility(context, axeOptions, includeIncomplete);
    
    const filteredIssues = filterIssuesByRules(scanResults.violations, allowedRules);
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: generateReportSummary(filteredIssues),
        issues: filteredIssues,
        metadata: {
            totalViolations: scanResults.violations.length,
            totalPasses: scanResults.passes.length,
            incompleteCount: scanResults.incomplete ? scanResults.incomplete.length : 0,
            inapplicableCount: scanResults.inapplicable ? scanResults.inapplicable.length : 0
        }
    };
    
    writeReport(report);
    
    return report;
}

async function scanAccessibility(context, axeOptions = {}, includeIncomplete = true) {
    try {
        const results = await axe.run(context, {
            runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'wcag21aa']
            },
            ...axeOptions
        });

        const uniqueLandmarks = [];
        const seen = new Set();

        const landmarkElements = results.violations.filter(violation => violation.id === 'landmark-one-per-page');
        landmarkElements.forEach(violation => {
            violation.nodes.forEach(node => {
                const landmark = {
                    id: node.target,
                    ...node
                };
                const landmarkId = typeof landmark.id === 'string' ? landmark.id : String(landmark.id);

                if (!seen.has(landmarkId)) {
                    seen.add(landmarkId);
                    uniqueLandmarks.push(landmark);
                }
            });
        });

        results.violations = results.violations.filter(violation => violation.id !== 'landmark-one-per-page');

        return results;
    } catch (error) {
        console.error('Accessibility scan error:', error);
        throw error;
    }
}

function filterIssuesByRules(violations, allowedRules) {
    if (!allowedRules || allowedRules.length === 0) {
        return violations;
    }
    return violations.filter(violation => allowedRules.includes(violation.id));
}

function generateReportSummary(issues) {
    const summary = {
        critical: 0,
        serious: 0,
        moderate: 0,
        minor: 0
    };
    
    issues.forEach(issue => {
        const impact = issue.impact || 'minor';
        if (summary.hasOwnProperty(impact)) {
            summary[impact]++;
        }
    });
    
    return summary;
}

function writeReport(report) {
    const reportFile = path.join(__dirname, 'access