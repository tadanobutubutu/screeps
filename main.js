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

// Call the new function to address the fake link
findAndFixFakeLinks();

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

// Fix for REACT_015: Ensure the <html> element has a lang attribute
// for screen reader accessibility (defaults to "en" if missing)
function ensureHtmlLangAttribute() {
  if (document.documentElement && !document.documentElement.getAttribute('lang')) {
    document.documentElement.setAttribute('lang', 'en');
  }
}

// Apply the fix to address the missing lang attribute
ensureHtmlLangAttribute();

// ... (existing code)