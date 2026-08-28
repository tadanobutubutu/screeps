import { class1, function1, Object1 } from './path/to/module';

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

export const metadata = {
  title: "Screeps Dashboard",
  description: "Dashboard for Screeps",
};

// Function to add lang attribute to HTML element
function addLangAttribute(document, lang = 'en') {
  const htmlElement = document.documentElement;
  if (htmlElement) {
    htmlElement.setAttribute('lang', lang);
  }
  return document;
}

// Function to add/main landmark
function addMainLandmark(document) {
  let mainElement = document.querySelector('main');
  
  if (!mainElement) {
    const body = document.body;
    const main = document.createElement('main');
    main.setAttribute('id', 'main-content');
    
    const children = Array.from(body.children);
    for (const child of children) {
      if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE' && 
          child.tagName !== 'LINK' && child.tagName !== 'META') {
        main.appendChild(child);
        break;
      }
    }
    
    body.insertBefore(main, body.firstChild);
    mainElement = main;
  }
  
  if (mainElement.tagName !== 'MAIN') {
    mainElement.setAttribute('role', 'main');
  }
  
  return mainElement;
}

// Function to ensure unique landmarks (combined approach)
function ensureUniqueLandmarks(document) {
  const landmarks = document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], main, nav, header, footer');
  const seen = new Map();
  
  landmarks.forEach(landmark => {
    const role = landmark.getAttribute('role') || landmark.tagName.toLowerCase();
    
    if (seen.has(role)) {
      const original = seen.get(role);
      const originalId = original.id || original.getAttribute('aria-label') || 'first';
      landmark.setAttribute('aria-label', `${role}-${originalId}`);
    } else {
      seen.set(role, landmark);
    }
  });
  
  return document;
}

// Function to add accessible name to SVG
function addSvgAccessibleNames(document) {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.getAttribute('aria-label') && !svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = `SVG graphic ${index + 1}`;
      svg.insertBefore(title, svg.firstChild);
    }
  });
  return document;
}

// Function to fix fake link issue (merged fixes)
function fixFakeLinkIssue(document) {
  const clickableElements = document.querySelectorAll('[onclick]');
  let count = 0;

  clickableElements.forEach(element => {
    const tagName = element.tagName.toLowerCase();
    const isAnchor = tagName === 'a';
    const hasHref = element.hasAttribute('href');
    const onclick = element.getAttribute('onclick') || '';
    
    if (!isAnchor && (onclick.includes('window.location') || 
        onclick.includes('document.location') || 
        onclick.includes('.href'))) {
      
      const span = document.createElement('span');
      span.textContent = element.textContent;
      span.setAttribute('role', 'link');
      span.setAttribute('tabindex', '0');
      span.setAttribute('onclick', onclick);
      span.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          element.click();
        }
      });
      
      if (element.className) {
        span.className = element.className;
      }
      
      element.parentNode.replaceChild(span, element);
      count++;
    }
  });

  return count;
}

// Function to fix fake link issues (handles both role="link" elements and anchors with href="#")
function fixFakeLinkIssues(document) {
  const roleLinks = document.querySelectorAll('[role="link"]');
  roleLinks.forEach(link => {
    if (link.tagName !== 'A') {
      link.setAttribute('aria-label', 'This link goes to a section within the page');
    }
  });

  const fakeLinks = document.querySelectorAll('a[href="#"]');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });

  return document;
}

// Accessibility fix for REACT_017: Add/fix landmark issues and add Landmark Regions
function fixLandmarkIssues(document) {
  const regions = document.querySelectorAll('[role="region"]');
  regions.forEach(region => {
    if (!region.id) {
      const label = region.getAttribute('aria-label');
      if (label) {
        region.id = `region-${label.toLowerCase().replace(/\s+/g, '-')}`;
      }
    }
  });
  return document;
}

function addLandmarkRegions(document) {
  const mainContent = document.querySelector('main') || document.querySelector('[role="main"]');
  if (mainContent && !mainContent.id) {
    mainContent.id = 'main-content';
  }
  return document;
}

// REACT_025: Ensure unique landmarks (by role approach)
function uniqueLandmarks(document) {
  return ensureUniqueLandmarks(document);
}

// Address accessibility issues from insight report for image alt texts
function fixImageAltTexts(document) {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.hasAttribute('alt')) {
      img.setAttribute('alt', `Image ${index + 1}`);
    }
  });
  return document;
}

// REACT_037: Google sign-in logic
function googleSignIn(document) {
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.initialize({
      client_id: 'YOUR_CLIENT_ID',
      callback: handleCredentialResponse
    });
    const buttonContainer = document.getElementById('g_id_onbutton');
    if (buttonContainer) {
      google.accounts.id.renderButton(
        buttonContainer,
        { theme: 'outline', size: 'large' }
      );
    }
  }
  return document;
}

// Function to handle credential response from Google Sign-In
function handleCredentialResponse(response) {
  console.log('Credential response received:', response);
}

// Function to ensure the element has an id
function ensureElementHasId(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element, index) => {
    if (!element.id) {
      element.id = `${idPrefix}-${index + 1}`;
    }
  });
  return document;
}

// Function to ensure an element has an id with origin/main optimization
function ensureElementHasIdOrigin(document, selector, idPrefix = 'element') {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    element.id = element.dataset.id || `${idPrefix}-${Math.random().toString(36).substr(2, 9)}`;
  });
  return document;
}

// Function to add aria-label to elements
function addAriaLabel(document, selector, label) {
  const elements = document.querySelectorAll(selector);
  elements.forEach((element) => {
    if (!element.getAttribute('aria-label')) {
      element.setAttribute('aria-label', label);
    }
  });
  return document;
}

// Function to render dependency graphs
function renderDependencyGraphs(document) {
  const graphContainer = document.querySelector('.dependency-graph-container') || 
                         document.querySelector('#dependency-graph') ||
                         document.querySelector('[data-graph="dependencies"]') ||
                         document.querySelector('div[data-type="dependency-graph"]');
  if (graphContainer) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dependency-graph');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.setAttribute('viewBox', '0 0 800 400');

    const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
    title.textContent = 'Dependency Graph';
    svg.appendChild(title);

    const desc = document.createElementNS('http://www.w3.org/2000/svg', 'desc');
    desc.textContent = 'Visual representation of project dependencies';
    svg.appendChild(desc);

    const graphContent = graphContainer.querySelector('.graph-content');
    if (graphContent) {
      // Parse and render dependency data
    }

    graphContainer.appendChild(svg);
  }
  return document;
}

export default function RootLayout({ children }) {
  addLangAttribute();
  addMainLandmark();

  document.documentElement.setAttribute('lang', 'en');
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
    console.warn('Multiple <main> landmarks detected. Consider using <section> or <article> for additional regions.');
  }

  const fakeLinks = document.querySelectorAll('.fake-link');
  fakeLinks.forEach(link => {
    link.setAttribute('role', 'presentation');
  });

  const links = document.querySelectorAll('a');
  const buttons = document.querySelectorAll('button');

  links.forEach(link => {
    if (!link.hasAttribute('role')) {
      link.setAttribute('role', 'link');
    }
    if (!link.hasAttribute('href')) {
      console.error('Link without href attribute', link);
    }
  });

  buttons.forEach(button => {
    if (!button.hasAttribute('role')) {
      button.setAttribute('role', 'button');
    }
    if (!button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
      console.error('Button without accessible name', button);
    }
  });

  return (
    <html lang="en">
      <head>
        <title>Screeps Dashboard</title>
        ...
      </head>
      <body>{children}</body>
    </html>
  );
}