// TODO: This is the existing code that needs to be preserved
// ----- BEGIN ORIGINAL CODE (unchanged) -----
// _Commit: 243c66538868c6b87845660312397ab39e0f830d_
// <!-- todo-hash: ... -->

// TODO: Implement this function for creating in-page buttons
function createInPageButton (buttonId, buttonText, buttonClass) {
  const button = document.createElement('button')
  button.id = buttonId
  button.textContent = buttonText
  button.className = buttonClass
  document.body.appendChild(button)
}

// Preserve any existing exports here
// export { existingFunction1, existingFunction2, ... };
