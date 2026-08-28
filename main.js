// Address accessibility issues from insight report
// Ensure the dependencyGraph container has a proper ARIA role
import './styles.css';
import { getUserData, calculateTotalPrice } from './utils.js';
import { renderGraphContent } from './dependency-graph';

const container = document.getElementById('dependencyGraph');
if (container) {
  const graphEl = container.querySelector('.dependencyGraph') || container;
  graphEl.setAttribute('role', 'tree');
  graphEl.setAttribute('aria-label', 'Dependency Graph');
}

// Render dependency graph content
function renderDependencyGraphContent(data) {
  const container = document.getElementById('dependencyGraph');
  if (container) {
    const graphContainer = container.querySelector('.dependencyGraph') || container;
    graphContainer.innerHTML = data;
  }
}

// Ensure unique landmarks
function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"]');
  const seen = new Set();
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role');
    if (seen.has(role)) {
      landmark.removeAttribute('role');
    } else {
      seen.add(role);
    }
  });
}

// Fix fake link issue
function fixFakeLinks() {
  const fakeLinks = document.querySelectorAll('span[role="link"], div[role="link"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'button');
    link.setAttribute('tabindex', '0');
    if (!link.getAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Button');
    }
  });
}

// New function to implement accessibility fixes
function implementNewFunction() {
  fixFakeLinks();
  ensureUniqueLandmarks();
}

// Add scope attribute to th elements for accessibility
function addScopeToTableHeaders() {
  const headers = document.querySelectorAll('th');
  headers.forEach(header => {
    if (!header.hasAttribute('scope')) {
      header.setAttribute('scope', 'col');
    }
  });
}

// New function to check if an element has an id
function hasElementId(element) {
  return element && element.id !== '';
}

// New function to add aria-label
function addElementAriaLabel(element, ariaLabel) {
  if (element && !element.hasAttribute('aria-label')) {
    element.setAttribute('aria-label', ariaLabel);
  }
}

/**
 * Renders a dependency graph visualization
 * @param {Object} dependencies - The dependencies to render
 * @returns {string} The rendered graph
 */
function renderDependencyGraph(dependencies) {
  // Implementation for rendering dependency graphs
  return '';
}

/**
 * Renders an index view
 * @param {Array} items - The items to display in the index
 * @returns {string} The rendered index view
 */
function renderIndexView(items) {
  // Implementation for rendering index views
  return '';
}

export function initializeApp() {
  // Initialize the application
  console.log('App initialized');
}

export function setupEventListeners() {
  // Setup all event listeners
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    button.addEventListener('click', handleButtonClick);
  });
}

export function handleButtonClick(event) {
  const target = event.target;
  // Handle button clicks
  if (target.id === 'checkout') {
    processCheckout();
  } else if (target.classList.contains('add-to-cart')) {
    addToCart(target.dataset.productId);
  }
}

export function addToCart(productId) {
  console.log('Adding to cart:', productId);
  const product = getProductById(productId);
  if (product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
  }
}

export function removeFromCart(productId) {
  console.log('Removing from cart:', productId);
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

export {
  renderDependencyGraph,
  renderIndexView,
  renderDependencyGraphContent,
  ensureUniqueLandmarks,
  fixFakeLinks,
  implementNewFunction,
  addScopeToTableHeaders,
  hasElementId,
  addElementAriaLabel,
  renderGraphContent
};