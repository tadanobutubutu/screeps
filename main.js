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
                  dashboardLayout Svg.setAttribute('aria-label', 'Dashboard icon');
                }
              });
            `
          }}
        />
        {/* Update the `icons` object in this component to include aria-label for the favicon SVG */}
        <icons aria-label="Screeps Dashboard Icon">
          {/* In your original code, 'icons' is probably defined somewhere in your components */}
        </icons>
      </>
    );
  }

  // Development mode - render children without the accessibility script
  return <>{children}</>;
}