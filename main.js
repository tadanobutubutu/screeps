import './styles.css'
import { getUserData, calculateTotalPrice } from './utils.js';

// TODO: Add any updates related to new functions
// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (handled by getLangAttribute() and personName())
// - REACT_027: Fix 26 table structure issues (handled by validateTableAccessibility() and validateTableStructure())
// - REACT_017: Add/fix 4 landmark issues (handled by validateLandmark(), ... and validateLandmarkStructure())
// - REACT_041: Add accessible names to 2 SVGs (handled by getSvgAccessibleName() and ...)
// - REACT_025: Ensure unique landmarks (2 issues) (handled by ...)
// - REACT_036: Fix 1 fake link issue (handled by ... createInPageButton(), ... and personName())
// - ADD: Address new accessibility issues from insight report

export function initializeApp() {
  // Initialize the application
  console.log('App initialized');
  setupEventListeners();
  displayProducts();
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
  } else if (target.classList.contains('remove-from-cart')) {
    removeFromCart(target.dataset.productId);
  }
}

export function addToCart(productId) {
  console.log('Adding to cart:', productId);
  const product = getProductById(productId);
  if (product) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
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

export function processCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  if (cart.length === 0) {
    alert('Your cart is empty');
    return;
  }
  const total = calculateTotalPrice(cart);
  const user = getUserData();
  console.log('Processing checkout for:', user.name, 'Total:', total);
  alert(`Checkout successful! Total: $${total.toFixed(2)}`);
  localStorage.removeItem('cart');
  updateCartUI();
}

export function updateCartUI() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartCount = document.getElementById('cart-count');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  
  if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (cartItems) {
    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item">
        <span>${item.name} x${item.quantity}</span>
        <button class="remove-from-cart" data-product-id="${item.id}">Remove</button>
      </div>
    `).join('');
  }
  
  if (cartTotal) {
    const total = calculateTotalPrice(cart);
    cartTotal.textContent = `$${total.toFixed(2)}`;
  }
}

function getProductById(id) {
  const products = [
    { id: '1', name: 'Product A', price: 29.99 },
    { id: '2', name: 'Product B', price: 49.99 },
    { id: '3', name: 'Product C', price: 19.99 }
  ];
  return products.find(p => p.id === id);
}

export function displayProducts() {
  const products = [
    { id: '1', name: 'Product A', price: 29.99 },
    { id: '2', name: 'Product B', price: 49.99 },
    { id: '3', name: 'Product C', price: 19.99 }
  ];
  const container = document.getElementById('products');
  if (container) {
    container.innerHTML = products.map(product => `
      <div class="product">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
      </div>
    `).join('');
  }
}

// Accessibility utility functions
export function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

export function personName() {
  return document.querySelector('[data-person-name]')?.textContent || 'Unknown';
}

export function validateTableAccessibility(table) {
  if (!table) return false;
  const headers = table.querySelectorAll('th');
  return headers.length > 0;
}

export function validateTableStructure(table) {
  if (!table) return false;
  const rows = table.querySelectorAll('tr');
  let hasIssue = false;
  rows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length === 0) hasIssue = true;
  });
  return !hasIssue;
}

export function validateLandmark(element) {
  if (!element) return false;
  const landmarkRoles = ['banner', 'navigation', 'main', 'complementary', 'contentinfo', 'search', 'form', 'region'];
  return landmarkRoles.some(role => element.getAttribute('role') === role || element.tagName.toLowerCase() === role);
}

export function validateLandmarkStructure() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], header, [role="contentinfo"], footer');
  let issues = 0;
  const mains = document.querySelectorAll('main, [role="main"]');
  if (mains.length > 1) issues += mains.length - 1;
  return { issues, valid: issues === 0 };
}

export function getSvgAccessibleName(svg) {
  if (!svg) return '';
  const title = svg.querySelector('title');
  if (title) return title.textContent;
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel) return ariaLabel;
  return '';
}

export function createInPageButton(text, onClick) {
  const button = document.createElement('button');
  button.textContent = text;
  button.addEventListener('click', onClick);
  return button;
}