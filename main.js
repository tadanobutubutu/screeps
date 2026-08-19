// Existing code from main.js goes here
// ...

// New function or changes requested in the issue go here
// Add the 'scope' attribute to <th> elements that are missing it
const addScopeToTh = (htmlString) => {
  return htmlString.replace(/<th>/g, '<th scope="col">');
};

// Function to ensure only one <main> element exists in the Dashboard component
const ensureSingleMainElement = (componentCode) => {
  // Check if there are multiple <main> elements in the component
  const mainCount = (componentCode.match(/<main>/g) || []).length;

  if (mainCount > 1) {
    // Replace the second <main> with a <section> or <article>
    // This assumes the second <main> is in the error state path
    return componentCode.replace(
      /<main>([\s\S]*?)<\/main>/,
      '<section>$1</section>'
    );
  }
  return componentCode;
};

// Example usage of the new function to fix the issue in the given files
const fixDependencyGraph = () => {
  const dependencyGraphFile = 'docs/dependency-graph.html';
  const content = fs.readFileSync(dependencyGraphFile, 'utf8');
  const updatedContent = addScopeToTh(content);
  fs.writeFileSync(dependencyGraphFile, updatedContent);
};

// Function to fix the Dashboard component
const fixDashboardComponent = () => {
  const dashboardFile = 'components/Dashboard.tsx';
  const content = fs.readFileSync(dashboardFile, 'utf8');
  const updatedContent = ensureSingleMainElement(content);
  fs.writeFileSync(dashboardFile, updatedContent);

  // Also fix the dashboard component in the dashboard folder
  const dashboardDashboardFile = 'dashboard/components/Dashboard.tsx';
  if (fs.existsSync(dashboardDashboardFile)) {
    const dashboardContent = fs.readFileSync(dashboardDashboardFile, 'utf8');
    const updatedDashboardContent = ensureSingleMainElement(dashboardContent);
    fs.writeFileSync(dashboardDashboardFile, updatedDashboardContent);
  }
};

// Ensure to call fixDashboardComponent() to apply the fix
// fixDashboardComponent();

// Rest of the main.js code goes here
// ...