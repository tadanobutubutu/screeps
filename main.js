import './styles.css'
import { getUserData, calculateTotalPrice } from './utils.js';

// TODO: Implement this function for accessibility checks on tables
// TODO: Add any updates related to new functions
// TODO: Identify and update specific functions that render dependency graphs or
// index views.

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

// Check if table has a caption
function checkTableAccessibility(table) {
  const issues = [];
  
  if (!table || !table.matches('table')) {
    return issues;
  }

  // Check if table has a caption
  const caption = table.querySelector('caption');
  if (!caption) {
    issues.push({
      type: 'missing-caption',
      message: 'Tables should have a caption element for accessibility'
    });
  }

  // Check if table headers (th) have scope attribute
  const headers = table.querySelectorAll('th');
  headers.forEach((header, index) => {
    if (!header.hasAttribute('scope')) {
      issues.push({
        type: 'missing-scope',
        message: `Header at index ${index} should have a scope attribute`,
        element: header
      });
    }
  });

  // Check if first row contains proper headers for data tables
  const firstRow = table.querySelector('tr');
  if (firstRow && firstRow.querySelector('th') === null) {
    issues.push({
      type: 'missing-header',
      message: 'First row should contain header elements (th) for data tables'
    });
  }

  // Check for proper headers association using headers/id attributes
  const cells = table.querySelectorAll('td[data-header-id]');
  cells.forEach(cell => {
    const headerId = cell.getAttribute('data-header-id');
    const associatedHeader = table.querySelector(`#${headerId}`);
    if (!associatedHeader) {
      issues.push({
        type: 'invalid-header-reference',
        message: `Cell references non-existent header id: ${headerId}`,
        element: cell
      });
    }
  });

  return issues;
}

// Export existing functions
export {
  renderDependencyGraph,
  renderIndexView,
  checkTableAccessibility
};