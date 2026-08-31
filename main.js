const { AxePuppeteer } = require('@axe-core/puppeteer');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

/**
 * Configuration object for accessibility scanning
 */
const config = {
  outputFormat: 'json',
  outputFilePath: './accessibility-report.json',
  urls: [],
  browserOptions: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
};

/**
 * Initialize browser instance
 * @returns {Promise<Browser>} Puppeteer browser instance
 */
async function initBrowser() {
  return await puppeteer.launch(config.browserOptions);
}

/**
 * Initialize a new page
 * @param {Browser} browser - Puppeteer browser instance
 * @returns {Promise<Page>} Puppeteer page instance
 */
async function initPage(browser) {
  const page = await browser.newPage();
  return page;
}

/**
 * Run accessibility scan on a given page
 * @param {Page} page - Puppeteer page instance
 * @param {string} url - URL to scan
 * @returns {Promise<Object>} Accessibility scan results
 */
async function scanPage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2' });
  
  const results = await new AxePuppeteer(page)
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  
  return results;
}

/**
 * Format the scan results into a readable report
 * @param {Object} results - Raw axe-core results
 * @param {string} url - URL that was scanned
 * @returns {Object} Formatted report data
 */
function formatReport(results, url) {
  const timestamp = new Date().toISOString();
  
  const violations = results.violations || [];
  const passes = results.passes || [];
  
  const report = {
    generatedAt: timestamp,
    url: url,
    summary: {
      totalViolations: violations.length,
      totalPasses: passes.length,
      impactCounts: {
        critical: violations.filter(v => v.impact === 'critical').length,
        serious: violations.filter(v => v.impact === 'serious').length,
        moderate: violations.filter(v => v.impact === 'moderate').length,
        minor: violations.filter(v => v.impact === 'minor').length
      }
    },
    violations: violations.map(v => ({
      id: v.id,
      impact: v.impact,
      description: v.description,
      help: v.help,
      helpUrl: v.helpUrl,
      nodes: v.nodes.map(n => ({
        html: n.html,
        target: n.target,
        any: n.any.map(a => a.id),
        all: n.all.map(a => a.id)
      }))
    })),
    metadata: results.metadata || {}
  };
  
  return report;
}

/**
 * Write report to file
 * @param {Object} report - Formatted report data
 * @param {string} outputPath - Path to write the report
 */
function writeReport(report, outputPath) {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Report written to: ${outputPath}`);
}

/**
 * Generate a report based on accessibility issues
 * @param {string|string[]} urls - URL or array of URLs to scan
 * @param {Object} options - Report generation options
 * @returns {Promise<Object>} Generated report(s)
 */
async function generateAccessibilityReport(urls, options = {}) {
  const urlsToScan = Array.isArray(urls) ? urls : [urls];
  const outputPath = options.outputPath || config.outputFilePath;
  
  const browser = await initBrowser();
  const allReports = [];
  
  try {
    for (const url of urlsToScan) {
      console.log(`Scanning: ${url}`);
      const page = await initPage(browser);
      
      const scanResults = await scanPage(page, url);
      const formattedReport = formatReport(scanResults, url);
      
      allReports.push(formattedReport);
      
      console.log(`Found ${formattedReport.summary.totalViolations} violations`);
      
      await page.close();
    }
    
    const finalReport = urlsToScan.length > 1 
      ? { pages: allReports } 
      : allReports[0];
    
    writeReport(finalReport, outputPath);
    
    return finalReport;
    
  } finally {
    await browser.close();
  }
}

/**
 * Generate a summary report from multiple scan results
 * @param {Object[]} results - Array of scan results
 * @returns {Object} Summary report
 */
function generateSummaryReport(results) {
  const summary = {
    totalPagesScanned: results.length,
    totalViolations: 0,
    critical: 0,
    serious: 0,
    moderate: 0,
    minor: 0,
    pages: results.map(r => ({
      url: r.url,
      violationCount: r.summary.totalViolations,
      impactBreakdown: r.summary.impactCounts
    }))
  };
  
  for (const result of results) {
    const counts = result.summary.impactCounts;
    summary.totalViolations += result.summary.totalViolations;
    summary.critical += counts.critical;
    summary.serious += counts.serious;
    summary.moderate += counts.moderate;
    summary.minor += counts.minor;
  }
  
  return summary;
}

module.exports = {
  generateAccessibilityReport,
  generateSummaryReport,
  scanPage,
  formatReport,
  writeReport,
  config
};