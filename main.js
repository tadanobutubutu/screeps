const img = document.getElementById('target'); let rotation = 0;

function rotate() {
  rotation += 90;
  img.style.transform = `rotate(${rotation}deg)`;
}

function rotateBack() {
  rotation = 0;
  img.style.transform = `rotate(0deg)`;
}

/**
 * Adds two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 */
function add(a, b) {
  return a + b;
}

/**
 * Subtracts b from a
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Difference of a and b
 */
function subtract(a, b) {
  return a - b;
}

/**
 * Multiplies two numbers together
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product of a and b
 */
function multiply(a, b) {
  return a * b;
}

/**
 * Divides a by b
 * @param {number} a - Dividend
 * @param {number} b - Divisor
 * @returns {number} Quotient of a and b
 */
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division by zero');
  }
  return a / b;
}

/**
 * Adds `aria-label` to elements
 * @param {HTMLElement} elem - Element to add `aria-label` to
 * @param {string} label - Text for the `aria-label` attribute
 */
function addAriaLabel(elem, label) {
  if (elem) {
    elem.setAttribute('aria-label', label);
  }
}

/**
 * Adds `aria-label` to buttons
 */
addAriaLabel(document.getElementById('rotate'), 'Rotate image clockwise');
addAriaLabel(document.getElementById('unrotate'), 'Rotate image anti-clockwise');
addAriaLabel(document.getElementById('target'), 'Rotated image');

// Add a new function for rendering a dependency graph
function renderDependencyGraph(dependencies, container) {
  if (!container || !dependencies) {
    return;
  }

  container.innerHTML = '';

  const fragment = document.createDocumentFragment();
  const title = document.createElement('h3');
  title.textContent = 'Dependency Graph';
  title.setAttribute('aria-label', 'Dependency graph title');
  fragment.appendChild(title);

  const list = document.createElement('ul');
  list.setAttribute('aria-label', 'List of dependencies');

  for (const [key, value] of Object.entries(dependencies)) {
    const item = document.createElement('li');
    item.textContent = `${key}: ${value}`;
    item.setAttribute('aria-label', `Dependency ${key} depends on ${value}`);
    list.appendChild(item);
  }

  fragment.appendChild(list);
  container.appendChild(fragment);
}

// Include the new function as an export
module.exports = {
  add,
  subtract,
  multiply,
  divide,
  rotate,
  rotateBack,
  addAriaLabel,
  renderDependencyGraph
};