function addLandmarkRegions() {
  const container = document.getElementById('landmark-regions-container');
  if (container) {
    container.innerHTML = `
      <div class="landmark-region" role="region" aria-label="Building">
        Main Building
      </div>
      <div class="landmark-region" role="region" aria-label="Park">
        Central Park
      </div>
    `;
  }
}

function fixAccessibilityIssues() {
  const images = document.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', '');
    }
  });

  const buttons = document.querySelectorAll('button');
  buttons.forEach((button) => {
    if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
      button.setAttribute('aria-label', 'Button');
    }
  });

  const links = document.querySelectorAll('a');
  links.forEach((link) => {
    if (!link.textContent.trim() && !link.hasAttribute('aria-label')) {
      link.setAttribute('aria-label', 'Link');
    }
  });

  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let headingLevel = 0;
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.charAt(1), 10);
    if (headingLevel === 0) {
      headingLevel = currentLevel;
    } else if (currentLevel > headingLevel + 1) {
      const correctedTag = `h${headingLevel + 1}`;
      const newHeading = document.createElement(correctedTag);
      newHeading.innerHTML = heading.innerHTML;
      heading.parentNode.replaceChild(newHeading, heading);
      headingLevel++;
    } else {
      headingLevel = currentLevel;
    }
  });

  const main = document.querySelector('main') || document.querySelector('[role="main"]');
  if (!main) {
    const mainElement = document.createElement('main');
    while (document.body.firstChild) {
      mainElement.appendChild(document.body.firstChild);
    }
    document.body.appendChild(mainElement);
  }
}

export { addLandmarkRegions, fixAccessibilityIssues };