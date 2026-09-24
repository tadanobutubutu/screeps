// main.js
import { renderHeader } from './components/header.js';
import { renderFooter } from './components/footer.js';
import { renderSidebar } from './components/sidebar.js';
import { renderModal } from './components/modal.js';
import { initializeAnalytics } from './analytics.js';
import { setupEventListeners } from './events.js';
import { loadUserPreferences } from './preferences.js';

const CONFIG = {
  apiUrl: 'https://api.example.com',
  theme: 'light',
  maxItems: 100
};

let appState = {
  user: null,
  currentPage: 'home',
  notifications: []
};

function initializeApp() {
  console.log('Initializing application...');
  loadUserPreferences();
  initializeAnalytics();
  setupEventListeners();
  renderApp();
}

function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  appContainer.innerHTML = `
    <div class="app-wrapper">
      <div id="header-container"></div>
      <div class="main-content">
        <div id="sidebar-container"></div>
        <div id="content-container"></div>
      </div>
      <div id="footer-container"></div>
    </div>
  `;

  renderHeader(document.getElementById('header-container'), appState);
  renderSidebar(document.getElementById('sidebar-container'), appState);
  renderFooter(document.getElementById('footer-container'));

  renderCurrentPage();
}

function renderCurrentPage() {
  const contentContainer = document.getElementById('content-container');
  if (!contentContainer) return;

  switch (appState.currentPage) {
    case 'home':
      renderHomePage(contentContainer);
      break;
    case 'dashboard':
      renderDashboardPage(contentContainer);
      break;
    case 'settings':
      renderSettingsPage(contentContainer);
      break;
    default:
      render404Page(contentContainer);
  }
}

function renderHomePage(container) {
  container.innerHTML = `
    <div class="home-page">
      <h1>Welcome to the Application</h1>
      <p>This is the home page content.</p>
    </div>
  `;
}

function renderDashboardPage(container) {
  container.innerHTML = `
    <div class="dashboard-page">
      <h1>Dashboard</h1>
      <div id="dashboard-stats"></div>
      <div id="dashboard-charts"></div>
    </div>
  `;

  renderDashboardStats(document.getElementById('dashboard-stats'));
  renderDashboardCharts(document.getElementById('dashboard-charts'));
}

function renderDashboardStats(container) {
  container.innerHTML = '<p>Loading stats...</p>';
}

function renderDashboardCharts(container) {
  container.innerHTML = '<p>Loading charts...</p>';
}

function renderSettingsPage(container) {
  container.innerHTML = `
    <div class="settings-page">
      <h1>Settings</h1>
      <form id="settings-form">
        <div class="form-group">
          <label for="theme-select">Theme:</label>
          <select id="theme-select" name="theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
      </form>
    </div>
  `;
}

function render404Page(container) {
  container.innerHTML = `
    <div class="error-page">
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  `;
}

function showNotification(message, type = 'info') {
  const notification = { message, type, timestamp: Date.now() };
  appState.notifications.push(notification);
  renderNotifications();
}

function renderNotifications() {
  const container = document.getElementById('notifications-container');
  if (!container) return;

  container.innerHTML = appState.notifications
    .map(n => `<div class="notification notification-${n.type}">${n.message}</div>`)
    .join('');
}

function showModal(title, content, actions = []) {
  const modalContainer = document.getElementById('modal-container');
  if (!modalContainer) return;

  renderModal(modalContainer, { title, content, actions });
}

function updateAppState(newState) {
  appState = { ...appState, ...newState };
  renderCurrentPage();
}

function handleNavigation(page) {
  appState.currentPage = page;
  window.history.pushState({ page }, '', `#${page}`);
  renderCurrentPage();
}

async function fetchData(endpoint) {
  try {
    const response = await fetch(`${CONFIG.apiUrl}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    showNotification('Failed to fetch data', 'error');
    return null;
  }
}

function validateForm(formData) {
  const errors = [];

  for (const [key, value] of Object.entries(formData)) {
    if (!value && value !== 0) {
      errors.push(`${key} is required`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Event handlers
function handleFormSubmit(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData.entries());

  const validation = validateForm(data);
  if (!validation.valid) {
    showNotification(validation.errors.join(', '), 'error');
    return;
  }

  console.log('Form submitted:', data);
  showNotification('Form submitted successfully!', 'success');
}

function handleClick(event) {
  const target = event.target;

  if (target.matches('[data-navigation]')) {
    event.preventDefault();
    const page = target.getAttribute('data-navigation');
    handleNavigation(page);
  }

  if (target.matches('[data-action]')) {
    event.preventDefault();
    const action = target.getAttribute('data-action');
    handleAction(action, target);
  }
}

function handleAction(action, element) {
  switch (action) {
    case 'show-modal':
      showModal('Action Required', '<p>Please confirm this action.</p>', [
        { label: 'Cancel', action: 'cancel' },
        { label: 'Confirm', action: 'confirm' }
      ]);
      break;
    case 'refresh':
      renderCurrentPage();
      showNotification('Page refreshed', 'info');
      break;
    default:
      console.log('Unknown action:', action);
  }
}

// Lifecycle methods
function onMount() {
  console.log('App mounted');
  initializeApp();
}

function onUnmount() {
  console.log('App unmounting');
  appState.notifications = [];
}

// Utility functions
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// Constants
const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAY_MS = 1000;
const CACHE_DURATION_MS = 5 * 60 * 1000;

// Cache implementation
const cache = new Map();

function setCache(key, value) {
  cache.set(key, {
    value,
    timestamp: Date.now()
  });
}

function getCache(key) {
  const item = cache.get(key);
  if (!item) return null;

  const isExpired = Date.now() - item.timestamp > CACHE_DURATION_MS;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return item.value;
}

function clearCache() {
  cache.clear();
}

// Export functions for testing and external use
export {
  initializeApp,
  renderApp,
  renderCurrentPage,
  renderHomePage,
  renderDashboardPage,
  renderSettingsPage,
  render404Page,
  showNotification,
  renderNotifications,
  showModal,
  updateAppState,
  handleNavigation,
  fetchData,
  validateForm,
  handleFormSubmit,
  handleClick,
  handleAction,
  onMount,
  onUnmount,
  formatDate,
  formatCurrency,
  deepClone,
  isEmpty,
  setCache,
  getCache,
  clearCache,
  appState,
  CONFIG
};

// Default export
export default {
  initialize: initializeApp,
  render: renderApp,
  update: updateAppState,
  navigate: handleNavigation
};