function ensureLanguageAttribute() {
  const htmlElement = document.querySelector('html');
  if (htmlElement && !htmlElement.hasAttribute('lang')) {
    htmlElement.setAttribute('lang', 'en');
  }
}

function enhanceTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    if (!table.querySelector('caption')) {
      const caption = document.createElement('caption');
      caption.textContent = `Table ${index + 1}`;
      table.prepend(caption);
    }
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.hasAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function ensureProperLandmarks() {
  const main = document.querySelector('main');
  if (main && !main.hasAttribute('role')) {
    main.setAttribute('role', 'main');
  }
  const nav = document.querySelector('nav');
  if (nav && !nav.hasAttribute('role')) {
    nav.setAttribute('role', 'navigation');
  }
}

function ensureSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach(svg => {
    if (!svg.hasAttribute('aria-label') && !svg.hasAttribute('aria-labelledby')) {
      svg.setAttribute('aria-label', 'Decorative graphic');
    }
  });
}

function ensureUniqueLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    for (let i = 1; i < mains.length; i++) {
      const section = document.createElement('section');
      section.innerHTML = mains[i].innerHTML;
      mains[i].replaceWith(section);
    }
  }
}

const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
headers.forEach((header, index) => {
  if (!header.hasAttribute('id')) {
    header.setAttribute('id', `heading-${index + 1}`);
  }
});

function uniqueLandmarks() {
  const links = document.querySelectorAll('[id^="unrotate"]');
  links.forEach(link => {
    const id = link.id;
    const index = id.split('-')[1];
    link.id = `unrotate-${index}`;
  });
}

const rotateBackLinks = document.querySelectorAll('#unrotate');
rotateBackLinks.forEach(link => {
  const button = document.createElement('button');
  button.id = link.id;
  button.textContent = link.textContent;
  button.addEventListener('click', () => {
    // Add your rotation logic here
    console.log('Rotation back triggered');
  });
  link.replaceWith(button);
});

// Initialize accessibility improvements when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  ensureLanguageAttribute();
  enhanceTableAccessibility();
  ensureProperLandmarks();
  ensureSvgAccessibility();
  ensureUniqueLandmarks();
  replaceFakeLinks();
});

function replaceFakeLinks() {
  const fakeLinks = document.querySelectorAll('[role="link"], [role="button"]');
  fakeLinks.forEach(element => {
    if (element.getAttribute('role') === 'link' && element.tagName.toLowerCase() !== 'a') {
      const anchor = document.createElement('a');
      anchor.href = element.getAttribute('data-href') || '#';
      anchor.textContent = element.textContent;
      element.replaceWith(anchor);
    }
  });
}