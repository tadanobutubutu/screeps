function addSvgAccessibility(svgElement) {
  if (!svgElement.hasAttribute('aria-hidden') && !svgElement.querySelector('title')) {
    svgElement.setAttribute('aria-label', 'Application icon');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    addSvgAccessibility(svg);
  });
});

function ensureSingleMain() {
  const mainElements = document.querySelectorAll('main');
  if (mainElements.length > 1) {
    for (let i = 1; i < mainElements.length; i++) {
      mainElements[i].parentNode.removeChild(mainElements[i]);
    }
  }
}

document.addEventListener('DOMContentLoaded', ensureSingleMain);

// [Your existing code remains unchanged]