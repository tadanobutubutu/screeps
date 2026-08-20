// app/layout.tsx
export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#000" />
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}

// dashboard/app/layout.tsx
export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="16" fill="#000" />
        </svg>
      </head>
      <body>{children}</body>
    </html>
  );
}