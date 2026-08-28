// TODO: Implement getSvgAccessibleName functionality

function getSvgAccessibleName(element) {
  // Check for aria-label attribute (highest priority)
  if (element.hasAttribute('aria-label')) {
    const label = element.getAttribute('aria-label');
    if (label && label.trim() !== '') {
      return label.trim();
    }
  }
  
  // Check for aria-labelledby attribute
  if (element.hasAttribute('aria-labelledby')) {
    const labelledById = element.getAttribute('aria-labelledby');
    if (labelledById && labelledById.trim() !== '') {
      const referencedElement = document.getElementById(labelledById);
      if (referencedElement) {
        const textContent = referencedElement.textContent;
        if (textContent && textContent.trim() !== '') {
          return textContent.trim();
        }
      }
    }
  }
  
  // Check for title element within SVG
  const title = element.querySelector('title');
  if (title && title.textContent && title.textContent.trim() !== '') {
    return title.textContent.trim();
  }
  
  // Check for desc element within SVG
  const desc = element.querySelector('desc');
  if (desc && desc.textContent && desc.textContent.trim() !== '') {
    return desc.textContent.trim();
  }
  
  return null;
}

module.exports = { getSvgAccessibleName };