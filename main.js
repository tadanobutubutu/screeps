// main.js
export function calculateTotal(items) {
  return items.reduce((total, item) => total + item.price, 0);
}

function getSvgAccessibleName(svg) {
  const ariaLabel = svg.getAttribute('aria-label');
  if (ariaLabel && ariaLabel.trim() !== '') {
    return ariaLabel;
  }
  const titleElement = svg.querySelector('title');
  if (titleElement && titleElement.textContent.trim() !== '') {
    return titleElement.textContent;
  }
  const descElement = svg.querySelector('desc');
  if (descElement && descElement.textContent.trim() !== '') {
    return descElement.textContent;
  }
  const labelledBy = svg.getAttribute('aria-labelledby');
  if (labelledBy) {
    const labelElement = document.getElementById(labelledBy);
    if (labelElement && labelElement.textContent.trim() !== '') {
      return labelElement.textContent;
    }
  }
  const describedBy = svg.getAttribute('aria-describedby');
  if (describedBy) {
    const descByElement = document.getElementById(describedBy);
    if (descByElement && descByElement.textContent.trim() !== '') {
      return descByElement.textContent;
    }
  }
  return null;
}

function setSvgAttributes(svg, accessibleName) {
  if (!accessibleName) {
    return;
  }
  if (!svg.hasAttribute('role')) {
    svg.setAttribute('role', 'img');
  }
  svg.setAttribute('aria-label', accessibleName);
}

// ... rest of the code ...