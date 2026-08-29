function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

function addLangAttribute() {
  document.documentElement.lang = 'en';
}

function addMainLandmark() {
  // Add main landmark functionality
  const mainElements = document.querySelectorAll('main');
  mainElements.forEach((main, index) => {
    if (!main.id) {
      main.id = `main-landmark-${index}`;
    }
  });
}

function addSvgAccessibleNames() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-labelledby') && !svg.getAttribute('aria-label')) {
      const title = document.createElement('title');
      title.id = `svg-title-${index}`;
      title.textContent = svg.id ? `SVG icon: ${svg.id}` : `SVG icon ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
      svg.setAttribute('aria-labelledby', title.id);
    }
  });
}

function ensureUniqueLandmarks() {
  const landmarks = document.querySelectorAll('[role="main"], main, [role="navigation"], nav, [role="banner"], [role="contentinfo"], [role="complementary"]');
  const landmarkTypes = {};
  
  landmarks.forEach(landmark => {
    const tag = landmark.tagName.toLowerCase();
    if (!landmarkTypes[tag]) {
      landmarkTypes[tag] = [];
    }
    landmarkTypes[tag].push(landmark);
  });
  
  Object.keys(landmarkTypes).forEach(type => {
    const landmarksOfType = landmarkTypes[type];
    if (landmarksOfType.length > 1) {
      landmarksOfType.forEach((landmark, index) => {
        if (index > 0) {
          landmark.removeAttribute('role');
        }
      });
    }
  });
}

function fixFakeLinkIssue() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.href && !link.getAttribute('onclick') && link.getAttribute('role') !== 'button') {
      link.setAttribute('role', 'presentation');
    }
  });
}

export default function RootLayout({ children }) {
  if (typeof window !== 'undefined') {
    addLangAttribute();
    addMainLandmark();
    addSvgAccessibleNames();
    ensureUniqueLandmarks();
    fixFakeLinkIssue();
  }

  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach(link => {
    if (link.getAttribute('href') === '#' || link.getAttribute('href') === '') {
      link.setAttribute('role', 'link');
    }
    if (!link.getAttribute('href') && !link.getAttribute('onclick') && link.getAttribute('role') !== 'button') {
      console.error('Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      button.setAttribute('role', 'button');
    }
    if (!button.textContent.trim() && !button.getAttribute('aria-label') && !button.getAttribute('aria-labelledby')) {
      console.error('Button without accessible name', button);
    }
  });

  return (
    <html lang="en">
      <head>
        <title>Screeps Dashboard</title>
      </head>
      <body>{children}</body>
    </html>
  );
}