/**
 * Fixes REACT_025: Multiple <main> landmarks
 * Ensures only one <main> element exists in the document
 */
function fixMainLandmarks() {
  const mains = document.querySelectorAll('main');
  if (mains.length > 1) {
    const mainToKeep = mains[0];
    for (let i = 1; i < mains.length; i++) {
      const mainEl = mains[i];
      const children = Array.from(mainEl.childNodes);
      children.forEach(child => mainToKeep.appendChild(child));
      mainEl.parentNode.removeChild(mainEl);
    }
  }
}

export default function Layout({ children }) {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <header role="banner">
        <nav aria-label="Main navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main id="main-content" role="main">
        {children}
      </main>

      <footer role="contentinfo">
        <nav aria-label="Footer navigation">
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
          </ul>
        </nav>
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </footer>

      // Added for accessibility
      {process.env.NODE_ENV === 'production' && (
        <>
          <script>
            window.addEventListener('load', function () {
              const appLayoutSvg = document.querySelector('app-layout svg');
              if (appLayoutSvg) {
                appLayoutSvg.setAttribute('aria-label', 'Application icon');
              }

              const dashboardLayoutSvg = document.querySelector('dashboard-app-layout svg');
              if (dashboardLayoutSvg) {
                dashboardLayoutSvg.setAttribute('aria-label', 'Dashboard icon');
              }
            });
          </script>
        </>
      )}
    </>
  );
}

// Run the fixes when the page loads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    fixMainLandmarks();
    fixSvgAccessibility();
  });
}

// ... (rest of existing code remains unchanged)