// ... (existing code)

// New function to address the React Fake Link
function makeRealLink(link) {
  if (link.tagName === 'A' && !link.href.includes('http')) {
    const button = document.createElement('button');
    button.textContent = link.textContent;
    link.parentNode.replaceChild(button, link);
    button.addEventListener('click', () => {
      const href = link.href.slice(1); // Remove the hash and use it as an anchor
      const element = document.getElementById(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

// New function to find and fix the fake link
function findAndFixFakeLinks() {
  const links = document.querySelectorAll('a[href="#"]');
  links.forEach(makeRealLink);
}

// Function to handle the case where there's only a hash in the URL (origin/main change)
function handleUrlWithHash() {
  window.onload = function () {
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };
}

// Combine both functions to address different scenarios
function addressLinks() {
  findAndFixFakeLinks();
  handleUrlWithHash();
}

// Call the combined function to address different link scenarios
addressLinks();

// Wrap the primary content in <main> to satisfy the REACT_017 rule
function wrapPrimaryContentInMain() {
  const primaryContent = document.querySelector('.container'); // Assuming '.container' is the primary content container
  if (primaryContent) {
    const mainElement = document.createElement('main');
    mainElement.appendChild(primaryContent);
    document.body.insertBefore(mainElement, document.body.firstChild);
  }
}

// Call the function to wrap the primary content in <main>
wrapPrimaryContentInMain();

// ... (existing code)