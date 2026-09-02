const http = require('http');
const path = require('path');
const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const app = express();
const { createServer, startApp, config } = require('./');

// Find the primary content element in the DOM
const primaryContent = (typeof document !== 'undefined') ? (document.querySelector('.primary-content') || document.querySelector('[role="main"]') || document.getElementById('main-content') || document.querySelector('#content')) : null;

// Address all accessibility issues
function addressInsightIssues() {
  getLangAttribute();
  addLangAttribute(typeof document !== 'undefined' ? (document.documentElement || document.body) : null);

  adjustH1();
  ensureUniqueLandmarks();
  ensureTableAccessibility();
  ensureTableStructure();
  ensureLinkAndButtonAccessibility();

  validateLandmark();
  validateLandmarkStructure();
}

// Implemented functions
function getLangAttribute() {
  // Add language to the HTML element
  document.documentElement.lang = 'en';
}

function addLangAttribute(element) {
  // Adds lang attribute to the given HTML element
  if (element && typeof element.setAttribute === 'function') {
    element.setAttribute('lang', 'en');
  }
}

function adjustH1() {
  // Ensure only one H1 header
  const h1s = document.querySelectorAll('h1');

  if (h1s.length > 1) {
    for (let i = 1; i < h1s.length; i++) {
      h1s[i].textContent = '';
    }
  }
}

function ensureUniqueLandmarks() {
  // Ensure only one main landmark
  const main = document.querySelector('main') || document.querySelector('[role="main"]') || document.getElementById('main-content');
  if (main) {
    document.querySelectorAll('landmark').forEach(landmark => {
      if (landmark !== main) {
        landmark.remove();
      }
    });
  }
}

function ensureTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    table.setAttribute('role', 'table');
  });
}

function ensureTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    if (!table.querySelector('thead')) {
      const thead = document.createElement('thead');
      const firstRow = table.querySelector('tr');
      if (firstRow) {
        thead.appendChild(firstRow);
        table.insertBefore(thead, table.querySelector('tbody') || table.firstChild);
      }
    }

    if (!table.querySelector('tbody')) {
      const tbody = document.createElement('tbody');
      const rows = table.querySelectorAll('tr');
      rows.forEach(row => {
        if (row.parentNode !== thead) {
          tbody.appendChild(row);
        }
      });
      table.appendChild(tbody);
    }
  });
}

function ensureLinkAndButtonAccessibility() {
  const linksAndButtons = document.querySelectorAll('a[href], button, [role="button"]');
  linksAndButtons.forEach(element => {
    if (!element.hasAttribute('aria-label')) {
      element.setAttribute('aria-label', element.textContent);
    }
  });
}

function validateLandmark(element) {
  return element.tagName === 'SECTION' || element.tagName === 'ARTICLE' || element.tagName === 'ASIDE';
}

function validateLandmarkStructure(element) {
  return element.id || element.getAttribute('aria-label');
}

// Export functions for testing
module.exports = {
  addressInsightIssues,
};