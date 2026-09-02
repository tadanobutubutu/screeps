const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec, spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

const config = {
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: process.env.TIMEOUT || 5000,
  debug: true,
  version: '1.0.0',
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development'
};

const AddressabilityIssues = {
  validateTableAccessibility: function (table) {
    if (typeof document !== 'undefined') {
      const headers = table.querySelectorAll('th');
      headers.forEach((th, index) => {
        if (!th.hasAttribute('scope')) {
          console.error(`Table header at index ${index} is missing scope attribute`);
        }
      });

      const hasCaption = table.querySelector('caption');
      const hasAriaLabel = table.getAttribute('aria-label') || table.getAttribute('aria-labelledby');

      if (!hasCaption && !hasAriaLabel) {
        console.error('Table is missing a caption or aria-label/aria-labelledby');
      }

      return { valid: true, errors: [] };
    }
    return { valid: true };
  },

  validateTableStructure: function (table) {
    if (typeof document !== 'undefined') {
      const errors = [];

      if (table.tagName.toLowerCase() !== 'table') {
        errors.push('The element is not a table');
      }

      if (!table.hasAttribute('summary')) {
        errors.push('The table must have a summary attribute');
      }

      return { valid: errors.length === 0, errors };
    }
    return { valid: true };
  }
};

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
      config.accessibility = packageJson.accessibility || {};
    }
  } catch (error) {
    console.error('Error loading configurations:', error.message);
  }
}

// Existing functionality
function calculateSum(a, b) {
  return a + b;
}

const XYZ = function () {
    // Implementation for XYZ function
};

// new functionality
function validateAllTables() {
  const tables = document.getElementsByTagName('table');
  for (const table of tables) {
    const accessible = AddressabilityIssues.validateTableAccessibility(table);
    const structure = AddressabilityIssues.validateTableStructure(table);
    if (!accessible || !structure) {
      console.warn('Table accessibility or structure validation failed:', table);
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', validateAllTables);
} else {
  validateAllTables();
}

module.exports = {
  config,
  XYZ,
  calculateSum
};