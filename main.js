// Example: Set the lang attribute on the root element dynamically
function setLanguage(lang) {
  document.documentElement.lang = lang;
}

// New function to convert anchor tags with specific IDs to buttons
function convertAnchorsToButtons() {
  const anchors = document.querySelectorAll('a[id="unrotate"]');
  anchors.forEach(anchor => {
    const button = document.createElement('button');
    button.id = anchor.id;
    button.type = 'button';
    button.textContent = anchor.textContent;
    anchor.parentNode.replaceChild(button, anchor);
  });
}

// Call the function to convert anchors to buttons
convertAnchorsToButtons();

// Other existing code...
// ...