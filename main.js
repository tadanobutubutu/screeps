// main.js

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// - REACT_041: Add accessible names to 2 SVGs
// These are decorative favicon SVGs, so marking them as hidden from assistive tech
const svg1 = document.querySelector('link[rel="icon"] svg, .favicon svg');
const svg2 = document.querySelector('link[rel="shortcut icon"] svg');
if (svg1) {
  svg1.setAttribute('aria-hidden', 'true');
}
if (svg2) {
  svg2.setAttribute('aria-hidden', 'true');
}

// - REACT_017: Add/fix 4 landmark issues
const landmarks = document.querySelectorAll('header, nav, main, footer');
landmarks.forEach((landmark, index) => {
  // Assuming you know which ARIA roles are correct for your landmarks
  landmark.setAttribute('role', 'landmark');
});

// Function to create an in-page button element
function createInPageButton(id, text, targetSelector) {
  const button = document.createElement('button');
  button.id = id;
  button.textContent = text;
  button.setAttribute('aria-label', text);
  
  const target = document.querySelector(targetSelector);
  if (target) {
    target.insertBefore(button, target.firstChild);
  }
  
  return button;
}

// Function to validate link accessibility
function validateLinkAccessibility() {
  if (typeof document === 'undefined') {
    return { valid: true, issues: [] };
  }
  
  const issues = [];
  const links = document.querySelectorAll('a[href]');
  
  links.forEach((link, index) => {
    // Check if link has accessible text
    const hasText = link.textContent.trim().length > 0;
    const hasAriaLabel = link.hasAttribute('aria-label');
    const hasAriaLabelledBy = link.hasAttribute('aria-labelledby');
    const hasTitle = link.hasAttribute('title');
    const hasImgAlt = link.querySelector('img[alt]');
    
    // Check for fake links (links with javascript: or # that behave like buttons)
    const href = link.getAttribute('href');
    const isJavascriptLink = href && href.startsWith('javascript:');
    const isHashOnly = href === '#' || href.startsWith('#!');
    const hasOnClick = link.hasAttribute('onclick');
    
    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy && !hasTitle && !hasImgAlt) {
      issues.push({
        type: 'missing-accessible-name',
        element: link,
        index: index
      });
    }
    
    if (isJavascriptLink || (isHashOnly && hasOnClick)) {
      issues.push({
        type: 'fake-link',
        element: link,
        index: index,
        message: 'This link appears to be used as a button. Consider using a <button> element instead.'
      });
    }
  });
  
  return { valid: issues.length === 0, issues };
}

// Function to handle fake links
function handleFakeLinks() {
  if (typeof document === 'undefined' || !document.body) {
    return;
  }
  
  const validation = validateLinkAccessibility();
  
  validation.issues.forEach((issue) => {
    if (issue.type === 'fake-link') {
      const link = issue.element;
      
      // Check if the link should be converted to a button
      const href = link.getAttribute('href');
      const isJavascriptLink = href && href.startsWith('javascript:');
      const isHashOnly = href === '#' || href.startsWith('#!');
      
      if (isJavascriptLink || isHashOnly) {
        // Replace link with button if it's being used as a button
        const button = document.createElement('button');
        
        // Copy all attributes except href
        Array.from(link.attributes).forEach((attr) => {
          if (attr.name !== 'href') {
            button.setAttribute(attr.name, attr.value);
          }
        });
        
        // Copy child nodes
        while (link.firstChild) {
          button.appendChild(link.firstChild);
        }
        
        // Copy inline styles
        button.style.cssText = link.style.cssText;
        
        // Add aria-pressed if it was on the original link
        if (link.hasAttribute('aria-pressed')) {
          button.setAttribute('aria-pressed', link.getAttribute('aria-pressed'));
        }
        
        // Replace the link with the button
        link.parentNode.replaceChild(button, link);
        
        // Add click handler to scroll to target instead of href behavior
        if (href && href.startsWith('#') && href.length > 1) {
          button.addEventListener('click', (e) => {
            const targetId = href.substring(1);
            const target = document.getElementById(targetId);
            if (target) {
              target.scrollIntoView({ behavior: 'smooth' });
              e.preventDefault();
            }
          });
        }
      }
    } else if (issue.type === 'missing-accessible-name') {
      const link = issue.element;
      
      // Add a generic accessible name if none exists
      if (!link.hasAttribute('aria-label') && !link.hasAttribute('aria-labelledby')) {
        const linkText = link.textContent.trim();
        if (linkText) {
          link.setAttribute('aria-label', linkText);
        } else {
          // Check if link contains an image
          const img = link.querySelector('img');
          if (img) {
            const altText = img.getAttribute('alt');
            if (altText) {
              link.setAttribute('aria-label', altText);
            }
          }
        }
      }
    }
  });
}

// main.js

function initializeAccessibility() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
  }

  // - REACT_025: Ensure unique landmarks (2 issues) - Updated code added below
  const landmark1 = document.querySelector('header[role="banner"]');
  const landmark2 = document.querySelector('footer[role="contentinfo"]');
  if (landmark1) {
    landmark1.setAttribute('aria-label', 'Main Header');
  }
  if (landmark2) {
    landmark2.setAttribute('aria-label', 'Footer');
  }

  const nav = document.querySelector('nav');
  if (nav) {
    nav.setAttribute('role', 'navigation');
  }

  const main = document.querySelector('main');
  if (main) {
    main.setAttribute('role', 'main');
  }

  const footer = document.querySelector('footer');
  if (footer) {
    footer.setAttribute('role', 'contentinfo');
  }

  // Handle fake links - Fix for TODO at line 46
  handleFakeLinks();

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.hasAttribute('hidden') ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.hasAttribute('aria-label');
      const hasAriaLabelledBy = svg.hasAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.closest('head') !== null;

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElement('title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  // Function to handle updating accessible SVG names when DOM mutates
  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  // Initial call to ensure SVG accessibility
  ensureSvgAccessibleNames();

  // Run again after DOM mutations
  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(() => {
      updateAccessibleSvgNames();
    });

    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['aria-hidden', 'aria-label', 'aria-labelledby']
      });
    }
  }

  // ... Add more checks for identifying and addressing other accessibility problems here
}

// Auto-initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAccessibility);
  } else {
    initializeAccessibility();
  }
}

// Export functions for testing (if using modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createInPageButton,
    validateLinkAccessibility,
    handleFakeLinks,
    rotateBack
  };
}