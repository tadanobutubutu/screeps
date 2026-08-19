// app/layout.tsx
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
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

        {process.env.NODE_ENV === 'production' && (
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
        )}
      </body>
    </html>
  );
}