// Existing code (preserved unchanged)

// TODO: Implement wrapPrimaryContentInMain function
function wrapPrimaryContentInMain(container) {
  // Add your implementation here
  const primaryContent = container.getElementsByClassName("primary-content")[0];
  const mainContainer = container.getElementsByTagName("main")[0];

  if (mainContainer && primaryContent) {
    mainContainer.appendChild(primaryContent);
  }
}

// Existing code (preserved unchanged)

module.exports = {
  // Existing exports (preserved unchanged)
};