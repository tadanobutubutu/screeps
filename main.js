// TODO: Address accessibility issues from insight report:

const button = document.createElement('button');
button.textContent = 'Click me';
button.setAttribute('aria-label', 'Click me button');
document.body.appendChild(button);