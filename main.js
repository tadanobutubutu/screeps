// main.js

import { default as FaviconSvgDashboard } from '~/icons/favicon-screeps-dashboard.svg?url';

export function DashboardLayout({ children }) {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-nav">
        <a href="/" className="dashboard-logo" aria-label="Screeps Dashboard">Screeps Dashboard</a>
        <div className="dashboard-nav-links">
          <a href="/">Console</a>
          <a href="/graph">Graph</a>
          <a href="/players">Players</a>
          <a href="/rooms">Rooms</a>
          <a href="/structures">Structures</a>
          <a href="/market">Market</a>
        </div>
      </div>
      <main className="dashboard-content">
        {children}
      </main>
    </div>
  );
}

export function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

// ... rest of the code ...

// For dashboard/app/layout.tsx
// <<<<<<< HEAD
// icons: { icon: FaviconSvgDashboard, viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg" },
// =======
// icons: { icon: FaviconSvgDashboard, viewBox: "0 0 100 100", xmlns: "http://www.w3.org/2000/svg", "aria-label": "Screeps Dashboard" },
// >>>>>>> branch-name

// ... rest of the code ...

// For app/layout.tsx
// <<<<<<< HEAD
// icons: {
//     icon: FaviconSvgDashboard,
//     viewBox: "0 0 100 100",
//     xmlns: "http://www.w3.org/2000/svg",
// },
// =======
// icons: {
//     icon: FaviconSvgDashboard,
//     viewBox: "0 0 100 100",
//     xmlns: "http://www.w3.org/2000/svg",
//     "aria-label": "Screeps Dashboard",
// },
// >>>>>>> branch-name

// ... rest of the code ...