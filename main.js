// TODO: Address accessibility issues from insight report: add aria attributes

/* Your existing code */

// Function to create an alert (example)
function showAlert(message) {
  /* Your existing code */
}

// Add the accessibility enhancement
function showAccessibleAlert(message) {
  const alertContainer = document.createElement('div');
  alertContainer.textContent = message;
  alertContainer.setAttribute('role', 'alert');
  alertContainer.setAttribute('aria-live', 'polite'); // updated
  document.body.appendChild(alertContainer);

  /* Add a timeout and remove the alert container, update the implementation as needed */
}

// Expose both functions, so you can use either one
module.exports = {
  showAlert,
  showAccessibleAlert
};