import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils.js';
import { renderHeader, renderFooter, renderProductCard, renderDependencyGraph, renderIndexView } from './components.js';
import { state, updateState } from './state.js';

function formatProductName(product) {
  return `${product.name} - ${product.category}`;
}

function renderProductList(products) {
  const container = document.getElementById('product-list');
  container.innerHTML = products.map(renderProductCard).join('');
  return container;
}

function calculateTotalPrice(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = calculateDiscount(subtotal);
  return subtotal - discount;
}

function renderCart(cart) {
  const total = calculateTotalPrice(cart);
  return `
    <div class="cart">
      <h2>Shopping Cart</h2>
      <p>Total: ${formatCurrency(total)}</p>
      <p>Date: ${formatDate(new Date())}</p>
    </div>
  `;
}

function validateAndRender(input) {
  if (validateInput(input)) {
    return renderProductList(input.products);
  }
  return '<p>Invalid input</p>';
}

function renderPage(data) {
  const header = renderHeader(data.title);
  const content = renderProductList(data.products);
  const footer = renderFooter();
  return `${header}${content}${footer}`;
}

function renderDependencyGraph(graphData) {
  return renderDependencyGraph(graphData);
}

function renderIndexView(indexData) {
  return renderIndexView(indexData);
}

export {
  formatProductName,
  renderProductList,
  calculateTotalPrice,
  renderCart,
  validateAndRender,
  renderPage,
  renderDependencyGraph,
  renderIndexView
};