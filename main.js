// Adding requested functions
function createInPageButton(href, text) {
  // Create a new div with the given text for an in-page link button
  const linkContainer = document.createElement('div');
  linkContainer.classList.add('in-page-link-button');
  linkContainer.innerHTML = `<a href="#" class="in-page-link">${text}</a>`;

  // Store the href and element for later use
  linkContainer.inPageLinkHref = href;
  linkContainer.inPageLink = linkContainer.querySelector('.in-page-link');

  return linkContainer;
}

function validateLinkAccessibility(link) {
  // Check if the link has an appropriate accessible label or a comprehensive text
  const label = link.getAttribute("aria-label");
  const textContent = link.textContent.trim();

  if (!label && textContent.length < 3) {
    return false;
  }

  return true;
}

function handleFakeLinks() {
  // Find all unaccessible anchor tags with empty hrefs
  const fakeLinks = document.querySelectorAll('a[href=""]');

  // Iterate through all found unaccessible links and replace them with in-page buttons
  fakeLinks.forEach((link) => {
    const text = link.textContent.trim();
    if (text.length > 3 && validateLinkAccessibility(link)) {
      // If the link is accessible, do nothing
      return;
    }

    // Replace the link with an in-page button
    const inPageLinkButton = createInPageButton(text, text);
    link.parentNode.replaceChild(inPageLinkButton, link);
  });
}

// TODO: Call handleFakeLinks() after an initial DOM load

// Remaining code preserves existing setup and exports

export function init() {
  // ...
}

// ...