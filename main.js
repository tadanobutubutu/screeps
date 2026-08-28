// TODO: Implement this function for creating in-page buttons

function createInPageButton(buttonId, label, onClickHandler) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = label;
  if (onClickHandler) {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}

// TODO: Implement this function for creating in-page buttons

function createInPageButton(buttonId, label, onClickHandler) {
  const button = document.createElement('button');
  button.id = buttonId;
  button.textContent = label;
  if (onClickHandler) {
    button.addEventListener('click', onClickHandler);
  }
  return button;
}