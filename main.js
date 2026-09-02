const utils = require('./utils');
const axe = require('axe-core');
const express = require('express');
const fs = require('fs');
const path = require('path');
const { a11y } = require('@accessible/react');
const requiredModule1 = require('required-module-1');
const requiredModule2 = require('required-module-2');
const fastMap = require('fast-map');
const accessiblyHelper = require('./accessibly-helper');
const { validateInput } = require('./utils/validators');
const { processData } = require('./utils/processor');

// Configuration
const CONFIG = {
  name: 'MyApp',
  version: '1.0.0',
  debug: false,
  dataPath: './data',
  maxResults: 100,
  apiUrl: process.env.API_URL || 'https://api.example.com',
  timeout: 5000,
  landmarkRoles: ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'region'],
  requiredLandmarks: ['banner', 'navigation', 'main']
};

// Application configuration (alias for CONFIG)
const config = CONFIG;

function addressInsightIssues() {
  const dependencyGraphContainer = document.querySelector('[data-dependency-graph]');
  if (dependencyGraphContainer) {
    dependencyGraphContainer.setAttribute('role', 'region');
    dependencyGraphContainer.setAttribute('aria-label', 'Dependency Graph Visualization');
  }
}

function fixTableStructureIssues() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    // Ensure table has proper caption if needed
    if (!table.querySelector('caption') && table.rows.length > 0) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table data';
      table.insertBefore(caption, table.firstChild);
    }

    // Ensure table has proper headers
    const headers = table.querySelectorAll('th');
    if (headers.length === 0) {
      // Add headers if missing
      const firstRow = table.rows[0];
      if (firstRow) {
        Array.from(firstRow.cells).forEach(cell => {
          const th = document.createElement('th');
          th.textContent = cell.textContent;
          cell.replaceWith(th);
        });
      }
    }

    // Ensure table has proper scope attributes for headers
    const headerRows = table.querySelectorAll('thead th');
    headerRows.forEach((th, index) => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

// Fix fake link issue
function fixFakeLinkIssue() {
  const fakeLinks = document.querySelectorAll('[href="#"], [href=""], [data-fake-link]');
  fakeLinks.forEach(link => {
    const fakeClass = link.getAttribute('class');
    if (fakeClass && fakeClass.includes('fake-link')) {
      return; // Skip if it is intentionally added with a class for non-clickable elements
    }

    link.setAttribute('role', 'button');
    link.setAttribute('href', 'javascript:void(0)');
  });
}

function addAccessibleNamesToSvgs() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    const title = svg.querySelector('title');
    if (title && title.textContent) {
      svg.setAttribute('aria-label', title.textContent);
    } else {
      svg.setAttribute('aria-label', 'Decorative graphic');
    }
  });
}

function updateAppData(newData) {
  const filePath = path.join(__dirname, config.dataPath, 'appData.json');
  fs.writeFileSync(filePath, JSON.stringify(newData));
}

function fetchData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      updateAppData(data);
      return data;
    });
}

function validateInputForDataFetch() {
  const input = document.getElementById('data-input').value;
  if (!validateInput(input, 'url')) {
    alert('Please enter a valid URL.');
    return;
  }
  const isAllowedUrl = utils.isValidUrl(input);
  if (!isAllowedUrl) {
    alert('The entered URL is not supported. Please enter an HTTP or HTTPS URL.');
    return;
  }
  fetchData(input);
}

const app = express();

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>MyApp</title>
      <!-- Include required files here -->
    </head>
    <body>
      <h1>MyApp</h1>
      <!-- Main content here -->
      <script src="/dist/main.js"></script>
    </body>
    </html>
  `;
  res.send(html);
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

addressInsightIssues();
fixTableStructureIssues();
fixFakeLinkIssue();
addAccessibleNamesToSvgs();