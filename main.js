// Assuming the original main.js generates the dependency-graph.html file
const fs = require('fs');

// ... other code ...

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Graph</title>
  <!-- other head content -->
</head>
<body>
  <!-- rest of the HTML content -->
</body>
</html>`;

fs.writeFileSync('docs/dependency-graph.html', htmlContent);

// New function to generate dependency dashboard information
function generateDependencyDashboard() {
  const dependencies = {
    npm: {
      "dashboard/package.json": [
        "@supabase/supabase-js ^2.47.0",
        "next ^16.2.11",
        "react ^19.0.0",
        "react-dom ^19.0.0",
        "@types/node ^24.0.0",
        "@types/react ^19.0.0",
        "postcss ^8.5.23",
        "typescript ^5.7.3"
      ],
      "package.json": [
        "express ^5.0.0",
        "react ^18.2.0",
        "lodash ^4.17.21",
        "jest ^29.6.1",
        "eslint ^8.47.0",
        "babel-jest ^29.6.1"
      ]
    },
    githubActions: {
      ".github/workflows/ai-guardian.yml": [
        "actions/checkout v7",
        "gitleaks/gitleaks-action v3",
        "SonarSource/sonarcloud-github-action master",
        "google/osv-scanner-action v2.5.0",
        "aquasecurity/trivy-action master",
        "github/codeql-action v3"
      ]
    }
  };

  const dashboardContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dependency Dashboard</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 20px; }
    h1 { color: #333; }
    h2 { color: #444; margin-top: 20px; }
    .dependency-section { margin-bottom: 30px; }
    .dependency-item { margin-left: 20px; }
    .update-available { color: #d9534f; font-weight: bold; }
  </style>
</head>
<body>
  <h1>Dependency Dashboard</h1>

  <div class="dependency-section">
    <h2>NPM Dependencies</h2>

    <h3>dashboard/package.json</h3>
    <ul>
      ${dependencies.npm["dashboard/package.json"].map(dep => `<li class="dependency-item">${dep}</li>`).join('')}
    </ul>

    <h3>package.json</h3>
    <ul>
      ${dependencies.npm["package.json"].map(dep => {
        if (dep.includes("^18.2.0") || dep.includes("^29.6.1") || dep.includes("^8.47.0") || dep.includes("^29.6.1")) {
          return `<li class="dependency-item">${dep} <span class="update-available">(Update available)</span></li>`;
        }
        return `<li class="dependency-item">${dep}</li>`;
      }).join('')}
    </ul>
  </div>

  <div class="dependency-section">
    <h2>GitHub Actions</h2>

    <h3>.github/workflows/ai-guardian.yml</h3>
    <ul>
      ${dependencies.githubActions[".github/workflows/ai-guardian.yml"].map(dep => {
        if (dep.includes("v2.5.0") || dep.includes("v3")) {
          return `<li class="dependency-item">${dep} <span class="update-available">(Update available)</span></li>`;
        }
        return `<li class="dependency-item">${dep}</li>`;
      }).join('')}
    </ul>
  </div>

  <div class="dependency-section">
    <h2>Pending Updates</h2>
    <ul>
      <li>Update google/osv-scanner-action to v2.5.1</li>
      <li>Update dependency eslint to v10</li>
      <li>Update dependency typescript to v7</li>
      <li>Update jest monorepo to v30 (babel-jest, jest)</li>
      <li>Update dependency react to v19</li>
    </ul>
  </div>
</body>
</html>
  `;

  fs.writeFileSync('docs/dependency-dashboard.html', dashboardContent);
}

// Call the new function to generate the dashboard
generateDependencyDashboard();