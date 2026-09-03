const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

/**
 * Accessibility functions
 */

function setHtmlLangAttribute(lang) {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang || 'en';
  }
  return lang || 'en';
}

function detectAndSetLang(content) {
  let lang = 'en';
  if (content) {
    if (/[\u4e00-\u9fff]/.test(content)) {
      lang = 'zh';
    } else if (/[\u3040-\u30ff]/.test(content)) {
      lang = 'ja';
    } else if (/[\u0400-\u04ff]/.test(content)) {
      lang = 'ru';
    } else if (/[\u0600-\u06ff]/.test(content)) {
      lang = 'ar';
    } else if (/[àâçéèêëîïôûùüÿœæ]/i.test(content)) {
      lang = 'fr';
    } else if (/[äöüß]/i.test(content)) {
      lang = 'de';
    }
  }
  return setHtmlLangAttribute(lang);
}

function getLangAttribute() {
  return (typeof document !== 'undefined' && document.documentElement) ? document.documentElement.lang : 'en';
}

function personName(name) {
  if (!name) return '';
  return name.trim();
}

// Validation functions for tables
function validateTableAccessibility(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const headers = table.querySelectorAll('th');
  headers.forEach((th, index) => {
    if (!th.hasAttribute('scope')) {
      errors.push(`Table header at index ${index} is missing scope attribute`);
    }
  });
  const hasCaption = table.querySelector('caption');
  const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');
  if (!hasCaption && !hasAriaLabel) {
    errors.push('Table is missing a caption or aria-label/aria-labelledby');
  }
  return { valid: errors.length === 0, errors };
}

function validateTableStructure(table) {
  const errors = [];
  if (!table) {
    return { valid: false, errors: ['Table element is required'] };
  }
  const tbody = table.querySelector('tbody');
  const thead = table.querySelector('thead');
  const tfoot = table.querySelector('tfoot');
  if (!thead) {
    errors.push('Table is missing thead element');
  }
  if (!tbody) {
    errors.push('Table is missing tbody element');
  }
  const rows = table.querySelectorAll('tbody tr');
  let expectedCols = null;
  rows.forEach((row, rowIndex) => {
    const cells = row.querySelectorAll('td, th');
    if (expectedCols === null) {
      expectedCols = cells.length;
    } else if (cells.length !== expectedCols) {
      errors.push(`Row ${rowIndex} has inconsistent cell count: expected ${expectedCols}, got ${cells.length}`);
    }
  });
  return { valid: errors.length === 0, errors };
}

/**
 * Main application entry point
 */

// Import required modules
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Application configuration
const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

// Implement function to count dependencies
function countDependencies() {
  const path = require('path');
  const fs = require('fs');

  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies).length,
    devDependencies: Object.keys(devDependencies).length,
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}

// Load configurations from package.json if it exists
function loadConfigurations() {
  try {
    const packagePath = path.join(__dirname, 'package.json');
    if (fs.existsSync(packagePath)) {
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      config.name = packageJson.name || 'dependency-counter';
      config.version = packageJson.version || '1.0.0';
      config.dependencies = packageJson.dependencies || {};
      config.devDependencies = packageJson.devDependencies || {};
    }
  } catch (error) {
    console.error('Error loading configurations:', error.message);
  }
}

// Start the app server
const server = http.createServer(app);
app.get('/', (req, res) => {
  const { dependencies, devDependencies, total } = countDependencies();
  const data = {
    name: config.name,
    version: config.version,
    dependencies,
    devDependencies,
    total
  };
  res.json(data);
});

server.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});