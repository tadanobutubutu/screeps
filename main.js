// Accessibility fixes for main.js

// REACT_015: Add lang attribute to HTML element
export function AppHtml({ children, lang = 'en' }) {
  return (
    <html lang={lang}>
      <body>
        {children}
      </body>
    </html>
  );
}

// REACT_017: Add/fix landmark issues
export function AccessibleLayout({ children }) {
  return (
    <div className="app-container">
      <header role="banner">
        <nav role="navigation" aria-label="Main navigation">
          {/* Navigation content */}
        </nav>
      </header>
      <main role="main" id="main-content">
        {children}
      </main>
      <aside role="complementary" aria-label="Sidebar">
        {/* Complementary content */}
      </aside>
      <footer role="contentinfo">
        {/* Footer content */}
      </footer>
    </div>
  );
}

// REACT_041: Add accessible names to SVGs
export function SvgIcon({ name, iconType }) {
  const titleId = `${iconType}-title`;
  return (
    <svg 
      aria-labelledby={titleId} 
      role="img"
      className={`icon icon-${iconType}`}
      aria-hidden="true"
    >
      <title id={titleId}>{name}</title>
      {/* SVG paths */}
    </svg>
  );
}

export function SocialIcon({ platform }) {
  return (
    <svg 
      aria-labelledby={`social-${platform}-title`}
      role="img"
      width="24"
      height="24"
    >
      <title id={`social-${platform}-title`}>{platform} icon</title>
      {/* SVG content */}
    </svg>
  );
}

// REACT_025: Ensure unique landmarks (2 issues)
export function Navigation() {
  return (
    <nav aria-label="Primary navigation" id="primary-nav">
      {/* Primary navigation items */}
    </nav>
  );
}

export function SecondaryNavigation() {
  return (
    <nav aria-label="Secondary navigation" id="secondary-nav">
      {/* Secondary navigation items */}
    </nav>
  );
}

// REACT_036: Fix 1 fake link issue
export function FakeLink({ href, onClick, children, className }) {
  // Use role="link" for elements that behave like links but aren't anchor tags
  return (
    <span 
      role="link"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.(e);
        }
      }}
      className={className}
      aria-label={children}
    >
      {children}
    </span>
  );
}

// REACT_027: React Table Structure (26 issues)
// Ensure all tables have proper structure
export function AccessibleTable({ headers, rows, caption }) {
  return (
    <table>
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} scope="col">{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Main export combining all accessibility improvements
export default function MainPage() {
  return (
    <AppHtml lang="en">
      <AccessibleLayout>
        <h1>Accessible Content</h1>
        <AccessibleTable 
          caption="Data table with proper structure"
          headers={['Name', 'Description', 'Status']}
          rows={[
            ['Item 1', 'Description 1', 'Active'],
            ['Item 2', 'Description 2', 'Inactive'],
          ]}
        />
        <div className="social-links">
          <SocialIcon platform="twitter" />
          <SocialIcon platform="facebook" />
        </div>
      </AccessibleLayout>
    </AppHtml>
  );
}

function rotateBack() {
  // JavaScript code to rotate back
  console.log('Rotating back...');
}

// Assuming the button click is handled by JavaScript, here's how it might look:
document.getElementById('unrotate').addEventListener('click', rotateBack);

// main.js

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

  // Function to ensure all SVG elements have accessible names
  const ensureSvgAccessibleNames = () => {
    if (typeof document === 'undefined' || !document.body) {
      return;
    }

    const svgs = document.querySelectorAll('svg');
    svgs.forEach((svg) => {
      // Check if SVG is hidden
      const isHidden = svg.getAttribute('aria-hidden') === 'true' ||
                       svg.getAttribute('hidden') !== null ||
                       svg.style.display === 'none' ||
                       svg.style.visibility === 'hidden';

      if (isHidden) {
        return;
      }

      // Check for existing accessible name
      const hasAriaLabel = svg.getAttribute('aria-label');
      const hasAriaLabelledBy = svg.getAttribute('aria-labelledby');
      const hasTitle = svg.querySelector('title');
      const hasDesc = svg.querySelector('desc');

      if (hasAriaLabel || hasAriaLabelledBy || hasTitle || hasDesc) {
        return;
      }

      // Determine if decorative - SVGs used for favicons/decorative purposes
      const isFavicon = svg.closest('link') !== null ||
                        (svg.parentElement && svg.parentElement.tagName === 'LINK') ||
                        svg.getAttribute('data-favicon') === 'true';

      if (isFavicon) {
        svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('focusable', 'false');
      } else {
        // Add a generic title for non-decorative SVGs
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
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
}

addProperLandmarkRegions();