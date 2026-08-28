// main.js - Accessibility fix applied

// Simple interactive page with content rotation functionality
function initApp() {
  const container = document.getElementById('app');
  
  // Create heading
  const h1 = document.createElement('h1');
  h1.textContent = 'My Page';
  h1.id = 'title';
  container.appendChild(h1);
  
  // Create content area
  const content = document.createElement('div');
  content.id = 'content';
  content.style.transition = 'transform 0.3s ease';
  content.style.transformOrigin = 'center center';
  container.appendChild(content);
  
  // Create button for rotating back (FIXED: changed from <a href="#"> to <button>)
  const unrotateBtn = document.createElement('button');
  unrotateBtn.id = 'unrotate';
  unrotateBtn.textContent = 'rotate back';
  unrotateBtn.setAttribute('aria-label', 'Rotate content back to original position');
  unrotateBtn.addEventListener('click', function() {
    content.style.transform = 'rotate(0deg)';
  });
  container.appendChild(unrotateBtn);
  
  // New function to render a dependency graph
  function renderDependencyGraph() {
    // Placeholder code for rendering a dependency graph
    // This function should be updated to include actual rendering logic
    console.log('Dependency graph rendering logic should be implemented here.');
  }
  
  // Call the new function to render the dependency graph
  renderDependencyGraph();
}

// Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

export { initApp };