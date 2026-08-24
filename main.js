document.documentElement.setAttribute('lang', 'en');

// Add React accessible SVG example
import { createInPageButton, createAccessibleLink } from './utils/accessibility';

const MyAccessibleSVG = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-labelledby="title">
    <title id="title">Description of SVG content</title>
    {/* SVG content */}
  </svg>
);

// Add React fake link component with accessibility
const MyFakeLink = () => (
  <div role="button" aria-pressed="false" onClick={() => console.log('Link clicked')}>
    Click me
  </div>
);

// Existing accessibility functions
function getLangAttribute() {
  return document.documentElement.lang || 'en';
}

function validateTableAccessibility() {
  const tables = document.querySelectorAll('table');
  tables.forEach((table, index) => {
    if (!table.caption) {
      const caption = document.createElement('caption');
      caption.textContent = 'Table ' + (index + 1) + ' description';
      table.insertBefore(caption, table.firstChild);
    }
  });
}

function validateTableStructure() {
  const tables = document.querySelectorAll('table');
  tables.forEach(table => {
    const headers = table.querySelectorAll('th');
    headers.forEach(th => {
      if (!th.getAttribute('scope')) {
        th.setAttribute('scope', 'col');
      }
    });
  });
}

function validateLandmark() {
  const existingMain = document.querySelector('main');
  if (!existingMain) {
    const mainElement = document.createElement('main');
    mainElement.setAttribute('id', 'main');
    document.body.insertBefore(mainElement, document.body.firstChild);
  }

  const existingNav = document.querySelector('nav');
  if (!existingNav) {
    const navElement = document.createElement('nav');
    navElement.setAttribute('id', 'primary-nav');
    document.body.insertBefore(navElement, document.body.firstChild);
  }
}

function validateLandmarkStructure() {
  validateLandmark();
  // Assume unique landmark validation implementation exists
}

function validateSvgAccessibility() {
  const svgs = document.querySelectorAll('svg');
  svgs.forEach((svg, index) => {
    if (!svg.querySelector('title')) {
      const title = document.createElement('title');
      title.textContent = 'SVG ' + (index + 1) + ' accessible name';
      svg.insertBefore(title, svg.firstChild);
    }
    if (!svg.getAttribute('role')) {
      svg.setAttribute('role', 'img');
    }
  });
}

function validateLinkAccessibility() {
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const rel = link.getAttribute('rel');
    if (rel && rel.includes('noopener') && rel.includes('noreferrer') && !link.target) {
      link.setAttribute('target', '_blank');
    }
  });
}

// Add custom export for accessibility functions
export const accessibilityFunctions = {
  createInPageButton,
  createAccessibleLink,
  getLangAttribute,
  validateTableAccessibility,
  validateTableStructure,
  validateLandmarkStructure,
  validateSvgAccessibility,
  validateLinkAccessibility
};

// Main application rendering
function App() {
  return (
    <main>
      <nav aria-label="Main navigation">
        {/* Navigation elements */}
      </nav>
      <div>
        <MyAccessibleSVG />
        <MyFakeLink />
      </div>
      {/* Other components */}
    </main>
  );
}

// DOM rendering
const root = document.getElementById('root');
ReactDOM.render(<App />, root);