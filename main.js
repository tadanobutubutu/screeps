import { getFullLangAttribute } from './utils/accessibilityUtils';
import { validateTableAccessibility, validateTableStructure, addScopeToTableHeaderCells } from './utils/tableAccessibilityUtils';
import { validateLandmark, validateLandmarkStructure, ensureUniqueLandmarks as ensureLandmarkUniqueness } from './utils/landmarkUtils';
import { getSvgAccessibleName, setSvgAttributes } from './utils/svgAccessibilityUtils';
import { validateLinkAccessibility, handleFakeLinks, createAccessibleLink } from './utils/linkAccessibilityUtils';
import { formatProductName, renderProductList, calculateTotalPrice, renderCart, validateAndRender, renderPage } from './utils/productUtils';
import { spawn } from './utils/spawnUtils';
import { checkLinkAccessibility } from './utils/linkAccessibilityUtils';
import { formatCurrency, formatDate, calculateDiscount, validateInput } from './utils';
import { renderHeader, renderFooter, renderProductCard } from './components';
import { state, updateState } from './state';

import { createInPageButton } from './utils/accessibilityUtils';

const handleReact015 = () => {
  const htmlElement = document.documentElement;
  const langAttr = getFullLangAttribute() || 'en';
  if (!htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', langAttr);
  }
};

const handleReact017AndReact025 = () => {
  const landmarks = document.querySelectorAll('header, nav, main, aside, footer, [role="banner"], [role="navigation"], [role="main"], [role="complementary"], [role="contentinfo"]');

  landmarks.forEach(landmark => {
    validateLandmark(landmark);
    validateLandmarkStructure(landmark);

    if (landmark.id) {
      const existingIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
      if (existingIds.filter(id => id === landmark.id).length > 1) {
        landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
      }
    } else {
      landmark.id = createLandmarkId(landmark.tagName.toLowerCase());
    }
  });

  ensureLandmarkUniqueness();
};

const handleReact041 = () => {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    const accessibleName = getSvgAccessibleName(svg);
    setSvgAttributes(svg, accessibleName);

    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby') && !svg.getAttribute('title')) {
      svg.setAttribute('aria-label', `SVG icon ${index + 1}`);
    }
  });
};

const handleReact036 = () => {
  const fakeLinks = document.querySelectorAll('a[href="#"], a[href=""], a:not([href])');
  fakeLinks.forEach(link => {
    if (link.hasAttribute('onclick') || link.classList.contains('button') || link.getAttribute('role') === 'button') {
      createAccessibleLink(link);
    }
  });

  handleFakeLinks();

  const suspiciousLinks = document.querySelectorAll('span[onclick], div[onclick], button');
  suspiciousLinks.forEach(element => {
    const onclickAttr = element.getAttribute('onclick');
    if (onclickAttr && (onclickAttr.includes('window.location') || onclickAttr.includes('document.location'))) {
      const newLink = document.createElement('a');
      newLink.href = element.getAttribute('onclick').match(/['"]([^'"]+)['"]/)?.[1] || '#';
      newLink.textContent = element.textContent;
      newLink.setAttribute('role', 'button');
      element.parentNode.replaceChild(newLink, element);
    }
  });
};

const ensureElementHasId = (elementId) => {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element && !element.hasAttribute('id')) {
    element.setAttribute('id', elementId);
  }
};

const addAriaLabelById = (elementId, label) => {
  const element = typeof document !== 'undefined' ? document.getElementById(elementId) : null;
  if (element) {
    element.setAttribute('aria-label', label);
  }
};

export { handleReact015, handleReact017AndReact025, handleReact041, handleReact036, ensureElementHasId, addAriaLabelById };