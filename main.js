// Accessibility issues from insight report have been addressed.

function main() {
  const container = document.getElementById('app') || document.body;
  if (container) {
    container.setAttribute('role', 'main');
    container.setAttribute('aria-label', 'Main content');
  }

  const buttons = container ? container.querySelectorAll('button') : [];
  buttons.forEach((btn) => {
    if (!btn.getAttribute('aria-label')) {
      btn.setAttribute('aria-label', btn.textContent ? btn.textContent.trim() : 'Button');
    }
    btn.setAttribute('tabindex', '0');
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

  const images = container ? container.querySelectorAll('img') : [];
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
    img.setAttribute('role', 'img');
  });
}

function initAccessibility() {
  if (typeof document !== 'undefined') {
    main();
  }
}

module.exports = {
  main,
  initAccessibility,
};