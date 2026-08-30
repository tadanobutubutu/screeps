// TODO: This is the existing code that needs to be preserved

// Address accessibility issues from insight report:
const createAccessibleButton = (label, onClick) => {
  const button = document.createElement('button');
  button.textContent = label;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', onClick);
  button.setAttribute('role', 'button');
  button.setAttribute('tabindex', '0');
  return button;
};

const createAccessibleInput = (type, placeholder, label) => {
  const wrapper = document.createElement('div');
  const input = document.createElement('input');
  const labelElement = document.createElement('label');
  
  input.type = type;
  input.placeholder = placeholder;
  input.setAttribute('aria-label', label);
  input.setAttribute('tabindex', '0');
  
  labelElement.textContent = label;
  labelElement.setAttribute('for', input.id);
  input.id = `input-${Date.now()}`;
  labelElement.htmlFor = input.id;
  
  wrapper.appendChild(labelElement);
  wrapper.appendChild(input);
  
  return wrapper;
};

module.exports = { createAccessibleButton, createAccessibleInput };