const fs = require('fs');
const path = require('path');

// Ensure directories exist
const appDir = path.join(__dirname, 'app');
const dashboardDir = path.join(__dirname, 'dashboard', 'app');

if (!fs.existsSync(appDir)) fs.mkdirSync(appDir, { recursive: true });
if (!fs.existsSync(dashboardDir)) fs.mkdirSync(dashboardDir, { recursive: true });

// Generate app/layout.tsx with accessible favicon
const appLayoutContent = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My App',
  description: 'Application description',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml" type="image/svg+xml" />
      </head>
      <body>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
          />
        </svg>
        {children}
      </body>
    </html>
  );
}
`;

// Generate dashboard/app/layout.tsx with accessible logo
const dashboardLayoutContent = `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard description',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            aria-label="Dashboard Logo"
          >
            <rect width="24" height="24" fill="currentColor" rx="4" />
          </svg>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
`;

// Write files
fs.writeFileSync(path.join(appDir, 'layout.tsx'), appLayoutContent);
fs.writeFileSync(path.join(dashboardDir, 'layout.tsx'), dashboardLayoutContent);

console.log('Layout files generated successfully!');