document.documentElement.setAttribute('lang', 'en');

function rotateBack() {
  console.log('Rotating back...');
}

document.getElementById('unrotate').addEventListener('click', rotateBack);

function addProperLandmarkRegions() {
  const header = document.querySelector('header');
  if (header) {
    header.setAttribute('role', 'banner');
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

  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.getAttribute('hidden') !== null ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('data-favicon') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = 'Icon';
        svg.insertBefore(title, svg.firstChild);
        svg.setAttribute('role', 'img');
        svg.setAttribute('aria-label', 'Icon');
      }
    });
  };

  const updateAccessibleSvgNames = () => {
    setTimeout(() => {
      ensureSvgAccessibleNames();
    }, 0);
  };

  ensureSvgAccessibleNames();

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
}

addProperLandmarkRegions();

const landmarks = document.querySelectorAll('.landmark');
landmarks.forEach((landmark, index) => {
  landmark.setAttribute('role', 'landmark');
  landmark.setAttribute('aria-labelledby', `landmark-label-${index}`);
});

const svg1 = document.querySelector('#svg1');
const svg2 = document.querySelector('#svg2');
if (svg1) {
  svg1.setAttribute('aria-labelledby', 'svg1-title');
}
if (svg2) {
  svg2.setAttribute('aria-labelledby', 'svg2-title');
}

const mainElements = document.querySelectorAll('main');
if (mainElements.length > 1) {
  console.warn('REACT_025: Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
}

const fakeLinks = document.querySelectorAll('.fake-link');
fakeLinks.forEach(link => {
  link.setAttribute('role', 'presentation');
});

// existing code...