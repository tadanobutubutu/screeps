// // TODO: Implement createInPageButton() and createAccessibleLink() functions here

/**
 * Creates an accessible link element
 * @param {string} text - The text content of the link
 * @param {string} href - The URL the link points to
 * @param {Object} options - Additional options for the link
 * @returns {HTMLAnchorElement} The created link element
 */
function createAccessibleLink(text, href, options = {}) {
  const link = document.createElement('a');
  link.textContent = text;
  link.href = href;
  
  if (options.className) {
    link.className = options.className;
  }
  if (options.id) {
    link.id = options.id;
  }
  if (options.target) {
    link.target = options.target;
  }
  if (options.rel) {
    link.rel = options.rel;
  }
  if (options.title) {
    link.title = options.title;
  }
  if (options.onClick) {
    link.addEventListener('click', options.onClick);
  }
  
  // Ensure accessibility attributes
  link.setAttribute('role', 'link');
  link.setAttribute('tabindex', '0');
  
  return link;
}

/**
 * Creates an in-page button element
 * @param {string} text - The text content of the button
 * @param {Object} options - Additional options for the button
 * @returns {HTMLButtonElement} The created button element
 */
function createInPageButton(text, options = {}) {
  const button = document.createElement('button');
  button.textContent = text;
  
  if (options.className) {
    button.className = options.className;
  }
  if (options.id) {
    button.id = options.id;
  }
  if (options.type) {
    button.type = options.type;
  } else {
    button.type = 'button';
  }
  if (options.disabled) {
    button.disabled = options.disabled;
  }
  if (options.title) {
    button.title = options.title;
  }
  if (options.onClick) {
    button.addEventListener('click', options.onClick);
  }
  
  return button;
}

// Import styles and utilities
import './styles.css';
import { getUserData, calculateTotalPrice } from './utils.js';

// Export utility functions
export { createAccessibleLink, createInPageButton };

// Export application functions
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
}