// TODO: Add any new functions or changes requested in the issue here
function checkHeadingHierarchy() {
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  let isValid = true;

  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.substring(1));
    if (currentLevel - lastLevel > 1 && lastLevel !== 0) {
      console.warn(`Heading hierarchy issue at heading ${index + 1}: h${lastLevel} to h${currentLevel} skips a level`);
      isValid = false;
    }
    lastLevel = currentLevel;
  });

  return isValid;
}

function rotateBack() {
  console.log('Rotating back...');
}

function addressAccessibilityIssues() {
  // existing code

  // ADD the new function to check link and button accessibility
  function checkLinkAndButtonAccessibility() {
    const links = document.querySelectorAll('a');
    const buttons = document.querySelectorAll('button');

    links.forEach(link => {
      if (!link.hasAttribute('role')) {
        link.setAttribute('role', 'link');
      }
      if (!link.hasAttribute('href')) {
        console.error('Accessibility Error: Link without href attribute', link);
      }
    });

    buttons.forEach(button => {
      if (!button.hasAttribute('role')) {
        button.setAttribute('role', 'button');
      }
      // Check for accessible name for buttons
      if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
        console.error('Accessibility Error: Button without accessible name', button);
      }
    });
  }

  // Call the function to check accessibility
  validateLinkAndButtonAccessibility();
}

// Export functions if needed
export { rotateBack, addressAccessibilityIssues };