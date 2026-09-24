// main.js - Contains utility functions for DOM manipulation and link handling

// ... existing code ...

// Line 74 - Implement this function for creating in-page buttons
function createInPageButton (options) {
  const defaults = {
    text: 'Button',
    className: 'in-page-button',
    container: document.body,
    id: null,
    title: '',
    disabled: false
  }

  const settings = Object.assign({}, defaults, options)

  const button = document.createElement('button')
  button.textContent = settings.text
  button.className = settings.className
  button.setAttribute('title', settings.title)
  button.disabled = settings.disabled

  if (settings.id) {
    button.id = settings.id
  }

  if (settings.style) {
    Object.assign(button.style, settings.style)
  }

  if (settings.onClick) {
    button.addEventListener('click', settings.onClick)
  }

  if (typeof settings.container === 'string') {
    const containerElement = document.querySelector(settings.container)
    if (containerElement) {
      containerElement.appendChild(button)
    }
  } else {
    settings.container.appendChild(button)
  }

  return button
}

// TODO: Any additional changes requested in the issue should be added after this function
// Example of additional function requested in the issue
function welcomeNewUser(newUser) {
  console.log(`Welcome, ${newUser}!`);
}

// Export the greet function
export { greet };