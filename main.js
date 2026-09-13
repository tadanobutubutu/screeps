// TODO: Address accessibility issues from insight report:
// - REACT_015: Add lang attribute to HTML element (DONE: addLangAttribute)
// - REACT_025: Add other accessibility changes as per the insight report
// - [NEW] ADD YOUR CODE HERE if any other issues need to be addressed

export function addLangAttribute(lang = 'en') {
  const html = document.documentElement;
  if (html) {
    html.lang = lang;
  }
}

export function initAccessibility() {
  addLangAttribute();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
  });
}

export function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg:not([aria-hidden="true"]):not([aria-label]):not([aria-labelledby])');
  svgs.forEach((svg) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'Screeps Dashboard';
      svg.insertBefore(title, svg.firstChild);
    }
  });
}

export function initSvgAccessibility() {
  addSvgAccessibleNames();
}

if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initAccessibility();
    initSvgAccessibility();
  });
}