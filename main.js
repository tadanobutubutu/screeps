export const handleRotateBack = () => {
  // Handle the rotate back functionality here
  document.body.style.transform = 'rotate(0deg)';
  document.body.style.transition = 'transform 0.3s ease';
};

const unrotatedButton = () => {
  const unrotateElement = document.getElementById('unrotate');
  if (unrotateElement && unrotateElement.tagName === 'A') {
    const button = document.createElement('button');
    button.id = 'unrotate';
    button.textContent = unrotateElement.textContent;

    button.className = unrotateElement.className;
    if (unrotateElement.style.cssText) {
      button.style.cssText = unrotateElement.style.cssText;
    }

    button.addEventListener('click', function() {
      handleRotateBack();
    });

    return button;
  }
  return null;
};

document.addEventListener('DOMContentLoaded', function() {
  const newUnrotateElement = unrotatedButton();

  if (newUnrotateElement) {
    unrotateElement.parentNode.replaceChild(newUnrotateElement, unrotateElement);
  }

  // Wrap the primary content in a <main> element for accessibility
  function wrapPrimaryContentWithMain() {
    const primaryContent = document.querySelector('table[id="table-rotated"], .container');
    if (primaryContent) {
      const mainElement = document.createElement('main');
      mainElement.appendChild(primaryContent);
      primaryContent.parentNode.insertBefore(mainElement, primaryContent);
    }
  }

  // Call the function to wrap the primary content
  wrapPrimaryContentWithMain();
});