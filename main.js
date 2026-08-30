// Import the createLinkButton() function from the other file
import { createLinkButton } from './path-to-link-button-function';

// Create a new function to create an internal link button
function createInternalLinkButton(href, label) {
  // Call the createLinkButton() function with proper properties for an internal link
  return createLinkButton({
    href: href,
    label: label,
    isInternal: true,
  });
}

// PRESERVE the existing code, exports, and functions...

// Assume existing exports section...

// Output:

// ...

// Leave the rest of the code as it is
exports.createInternalLinkButton = createInternalLinkButton;