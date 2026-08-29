// main.js - Application entry point

// Import dependencies
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  appName: 'MyApp',
  version: '1.0.0',
  debug: false
};

// Helper functions
function log(message) {
  if (CONFIG.debug) {
    console.log(`[LOG] ${message}`);
  }
}

function validateInput(input) {
  if (!input || typeof input !== 'string') {
    throw new Error('Invalid input provided');
  }
  return input.trim();
}

// Data processing functions
function processData(data) {
  log('Processing data...');
  return data.map(item => ({
    ...item,
    processed: true,
    timestamp: Date.now()
  }));
}

function filterData(data, criteria) {
  return data.filter(item => {
    return Object.keys(criteria).every(key => item[key] === criteria[key]);
  });
}

function aggregateData(data) {
  return {
    count: data.length,
    sum: data.reduce((acc, item) => acc + (item.value || 0), 0),
    average: data.length > 0 
      ? data.reduce((acc, item) => acc + (item.value || 0), 0) / data.length 
      : 0
  };
}

// Utility functions
function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split('T')[0];
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

// File operations
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    log(`Error reading file: ${error.message}`);
    return null;
  }
}

function writeJsonFile(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    log(`Error writing file: ${error.message}`);
    return false;
  }
}

// Validation functions
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// String manipulation utilities
function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function truncate(str, maxLength) {
  if (!str || str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Array utilities
function unique(array) {
  return [...new Set(array)];
}

function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

function flatten(array) {
  return array.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flatten(val)) : acc.concat(val), []
  );
}

// Object utilities
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function mergeObjects(...objects) {
  return Object.assign({}, ...objects);
}

// Date utilities
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round(Math.abs((date1 - date2) / oneDay));
}

// TODO: Re-add the required exports for functionA and functionB
// Assuming that they are objects with properties X, Y, and Z

// Main export
module.exports = {
  // Existing exports
  CONFIG,
  log,
  validateInput,
  processData,
  filterData,
  aggregateData,
  formatDate,
  generateId,
  readJsonFile,
  writeJsonFile,
  validateEmail,
  validateUrl,
  capitalize,
  truncate,
  slugify,
  unique,
  chunk,
  flatten,
  deepClone,
  mergeObjects,
  addDays,
  daysBetween,
  
  // Re-added exports for functionA and functionB
  functionA: {
    X: 'valueX',
    Y: 'valueY',
    Z: 'valueZ',
    execute: function() {
      return { X: this.X, Y: this.Y, Z: this.Z };
    }
  },
  
  functionB: {
    X: 'defaultX',
    Y: 'defaultY',
    Z: 'defaultZ',
    execute: function() {
      return { X: this.X, Y: this.Y, Z: this.Z };
    }
  }
};