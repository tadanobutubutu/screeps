export default function Layout({ children }) {
  // Original code...

  // Added for accessibility
  if (process.env.NODE_ENV === 'production') {
    return (
      <>
        {/* Rest of the code */}
        <>
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
      </>
    );
  }

  // Rest of the code...
}