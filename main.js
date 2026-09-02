function setSvgAttributes(svg) {
  if (svg && svg.setAttribute) {
    const accessibleName = svg.getAttribute('id') || '';
    if (accessibleName) {
      svg.setAttribute('aria-label', accessibleName);
    }
  }
}

function main() {
  const svgElements = document.querySelectorAll('svg');

  svgElements.forEach((svg) => {
    setSvgAttributes(svg);
  });

  checkLandmarkElements();
}

function helperFunction() {
  const accessibleName = document.title || 'Untitled';
  if (accessibleName) {
    // Use accessibleName
  }
}

function getSvgAccessibleName(svgElements) {
  if (svgElements.length > 0) {
    const firstSvg = svgElements[0];
    return firstSvg.getAttribute('aria-label') || firstSvg.getAttribute('id') || '';
  }
  return '';
}

function checkLandmarkElements() {
  const landmarkRoles = [
    'banner',
    'main',
    'navigation',
    'search',
    'contentinfo',
    'complementary',
    'region'
  ];

  const checkLandmarkElement = (selector, role) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((element) => {
      const tagName = element.tagName ? element.tagName.toLowerCase() : '';
      const landmarkRole = element.getAttribute ? element.getAttribute('role') : tagName;

      if (!landmarkRole) {
        console.warn(`Missing landmark role for ${tagName}`);
      }
    });
  };

  checkLandmarkElement('main', 'main');
  checkLandmarkElement('header', 'banner');
  checkLandmarkElement('nav', 'navigation');
  checkLandmarkElement('footer', 'contentinfo');
  checkLandmarkElement('aside', 'complementary');
  checkLandmarkElement('[role="form"], form', 'form');
}

export { setSvgAttributes, main, checkLandmarkElements };

function countDependencies() {
  const fs = require('fs');
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = fs.readFileSync(packageJsonPath, 'utf8');

  const dependencies = packageJson.dependencies || {};
  const devDependencies = packageJson.devDependencies || {};

  return {
    dependencies: Object.keys(dependencies),
    devDependencies: Object.keys(devDependencies),
    total: Object.keys(dependencies).length + Object.keys(devDependencies).length
  };
}