const { JSDOM } = require('jsdom'); // Make sure to install jsdom if not already installed: npm install jsdom

// Possible to refactor this function further, but it should serve as a starting point
function checkLinkAccessibility(link) {
  const dom = new JSDOM(`<!DOCTYPE html><html><body><a id="link" href="${link}">Link</a></body></html>`);
  const linkElement = dom.window.document.querySelector("#link");

  // It's generally a good idea to check if the link element exists before proceeding
  if (!linkElement) return null;

  try {
    // Try getting the link href using the " children " method (for SVG in IE11)
    linkElement.children[1].href;
  } catch (err) {
    return { accessible: false, message: "Link is not a standard HTML link element" };
  }

  // Check if the link has a valid protocol
  if (!/^(?:http|https|mailto|tel|ftp):/.test(link)) {
    return { accessible: false, message: "Link does not have a valid protocol" };
  }

  return { accessible: true };
}

// Example usage
console.log(checkLinkAccessibility('http://example.com')); // { accessible: true }
console.log(checkLinkAccessibility('example.com')); // { accessible: false, message: "Link does not have a valid protocol" }