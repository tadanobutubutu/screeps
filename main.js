// main.js

// Rendered views configuration
const renderedViews = {
  dashboard: { template: 'dashboard', update: true },
  profile: { template: 'profile', update: false },
  settings: { template: 'settings', update: true }
};

// View registry to track all rendered views
const viewRegistry = {
  views: [],
  register(viewName, viewData) {
    this.views.push({ name: viewName, data: viewData, timestamp: Date.now() });
  },
  getAll() {
    return this.views;
  }
};

// Function that renders a view
function renderView(viewName, container) {
  const viewConfig = renderedViews[viewName];
  if (!viewConfig) {
    console.error(`View ${viewName} not found`);
    return;
  }
  
  // TODO: Identify and update specific functions that call these rendered views.
  
  // Render the view
  const viewData = {
    name: viewName,
    config: viewConfig,
    container: container
  };
  
  // Register the view
  viewRegistry.register(viewName, viewData);
  
  // Apply updates if needed
  if (viewConfig.update) {
    updateViewDependencies(viewName);
  }
  
  return viewData;
}

// Update functions that depend on rendered views
function updateViewDependencies(viewName) {
  // Find all functions that depend on this view
  const viewHandlers = getViewHandlers(viewName);
  
  viewHandlers.forEach(handler => {
    if (typeof handler.update === 'function') {
      handler.update();
    }
  });
}

// Get handlers for specific views
function getViewHandlers(viewName) {
  const handlers = [];
  
  // Built-in handlers for common views
  if (viewName === 'dashboard') {
    handlers.push({
      name: 'dashboardStats',
      update: () => {
        console.log('Updating dashboard stats');
        return { updated: true, timestamp: Date.now() };
      }
    });
  }
  
  return handlers;
}

// Refresh all views that need updating
function refreshViews() {
  const allViews = viewRegistry.getAll();
  
  allViews.forEach(view => {
    if (renderedViews[view.name]?.update) {
      renderView(view.name, view.data.container);
    }
  });
}

// Initialize views
function initApp() {
  renderView('dashboard', 'main-content');
  renderView('profile', 'sidebar');
  renderView('settings', 'modal');
  
  return { initialized: true, views: viewRegistry.getAll().length };
}

module.exports = {
  renderView,
  refreshViews,
  updateViewDependencies,
  getViewHandlers,
  viewRegistry,
  renderedViews,
  initApp
};