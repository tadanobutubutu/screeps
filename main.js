// main.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Existing functions
function getUserData(userId) {
  // Simulate fetching user data
  return {
    id: userId,
    name: 'Test User',
    email: 'test@example.com'
  };
}

function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// New function for handling dependency updates
function handleDependencyUpdates(updates) {
  const awaitingSchedule = updates.filter(update => update.status === 'awaiting');
  const closedPRs = updates.filter(update => update.status === 'closed');

  return {
    awaitingSchedule,
    closedPRs,
    totalUpdates: updates.length
  };
}

// New function for processing dependency dashboard data
function processDashboardData(data) {
  const groupedByType = {};

  data.dependencies.forEach(dep => {
    if (!groupedByType[dep.type]) {
      groupedByType[dep.type] = [];
    }
    groupedByType[dep.type].push(dep);
  });

  return {
    groupedByType,
    totalDependencies: data.dependencies.length,
    lastUpdated: new Date().toISOString()
  };
}

// New function to generate accessible SVG favicon
function generateAccessibleFavicon() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" role="img" aria-label="Application Favicon">
      <title>Application Favicon</title>
      <desc>A blue circle representing the application favicon</desc>
      <circle cx="50" cy="50" r="40" fill="#4a6baf" />
    </svg>
  `;
}

// New function to handle rotation back action
function handleRotationBack() {
  // Implement the rotation back logic here
  console.log('Rotating back to original view');
  // This would typically update the UI state or trigger a React state change
}

// New function to generate accessible table structure
function generateAccessibleTable(data) {
  return `
    <table role="grid" aria-label="Dependency Dashboard">
      <thead>
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Version</th>
          <th scope="col">Type</th>
        </tr>
      </thead>
      <tbody>
        ${data.dependencies.map(dep => `
          <tr>
            <td>${dep.name}</td>
            <td>${dep.version}</td>
            <td>${dep.type}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

// New function to generate accessible landmarks
function generateAccessibleLandmarks() {
  return `
    <header role="banner" aria-label="Main Header">
      <h1>Dependency Dashboard</h1>
    </header>
    <main role="main" aria-label="Main Content">
      <!-- Main content goes here -->
    </main>
    <footer role="contentinfo" aria-label="Footer">
      <!-- Footer content goes here -->
    </footer>
  `;
}

// Existing route
app.get('/api/user/:id', (req, res) => {
  const userId = req.params.id;
  const userData = getUserData(userId);
  res.json(userData);
});

// New route for dependency dashboard
app.get('/api/dependencies', (req, res) => {
  // This would normally come from your dependency management system
  const mockData = {
    dependencies: [
      { name: 'express', version: '5.0.0', type: 'npm' },
      { name: 'react', version: '19.0.0', type: 'npm' },
      { name: 'jest', version: '30.0.0', type: 'npm' },
      { name: 'typescript', version: '7.0.0', type: 'npm' },
      { name: 'codeql-action', version: '4.0.0', type: 'github-actions' }
    ]
  };

  const processedData = processDashboardData(mockData);
  res.json(processedData);
});

// New route for dependency updates
app.get('/api/dependency-updates', (req, res) => {
  // This would normally come from Renovate or your dependency management system
  const mockUpdates = [
    { name: 'eslint', version: '10.0.0', status: 'awaiting' },
    { name: 'jest', version: '30.0.0', status: 'awaiting' },
    { name: 'typescript', version: '7.0.0', status: 'awaiting' },
    { name: 'codeql-action', version: '4.0.0', status: 'closed' }
  ];

  const updateSummary = handleDependencyUpdates(mockUpdates);
  res.json(updateSummary);
});

// New route to handle rotation back action
app.post('/api/rotate-back', (req, res) => {
  handleRotationBack();
  res.json({ success: true, message: 'Rotation back action completed' });
});

// New route for accessible favicon
app.get('/favicon.svg', (req, res) => {
  res.set('Content-Type', 'image/svg+xml');
  res.send(generateAccessibleFavicon());
});

// New route for accessible table
app.get('/api/accessible-table', (req, res) => {
  const mockData = {
    dependencies: [
      { name: 'express', version: '5.0.0', type: 'npm' },
      { name: 'react', version: '19.0.0', type: 'npm' },
      { name: 'jest', version: '30.0.0', type: 'npm' }
    ]
  };
  res.send(generateAccessibleTable(mockData));
});

// New route for accessible landmarks
app.get('/api/accessible-landmarks', (req, res) => {
  res.send(generateAccessibleLandmarks());
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Export all functions for testing
module.exports = {
  getUserData,
  calculateTotal,
  handleDependencyUpdates,
  processDashboardData,
  generateAccessibleFavicon,
  handleRotationBack,
  generateAccessibleTable,
  generateAccessibleLandmarks
};