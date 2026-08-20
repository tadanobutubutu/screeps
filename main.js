export default function Layout({ children }) {
  // Main layout component with accessibility enhancements

  if (process.env.NODE_ENV === 'production') {
    return (
      <>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
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
            `
          }}
        />
      </>
    );
  }

  // Development mode - render children without the accessibility script
  return <>{children}</>;
}