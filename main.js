function hasMultipleMainElements() {
  return document.querySelectorAll('main').length > 1;
}

function addAccessibleNameToSVGs() {
  const svgElements = document.querySelectorAll('svg');
  svgElements.forEach(svg => {
    if (!svg.querySelector('title') && !svg.querySelector('use') && !svg.getAttribute('aria-hidden')) {
      svg.setAttribute('aria-hidden', 'true');
    }
  });
}

// Ensure the function to add accessible names is called when the document is ready
document.addEventListener('DOMContentLoaded', addAccessibleNameToSVGs);