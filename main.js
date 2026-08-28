import './styles.css'
import { getUserData, calculateTotalPrice } from './utils.js';

// TODO: Add any updates related to new functions

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

function getProductById(productId) {
  // Placeholder for product lookup
  return { id: productId, price: 0 };
}

function updateCartUI() {
  // Placeholder for cart UI update
}

function processCheckout() {
  // Placeholder for checkout processing
  const user = getUserData();
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = calculateTotalPrice(cart);
  console.log('Processing checkout for', user, 'with total:', total);
}