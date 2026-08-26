export default function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctitle%3EScreeps Dashboard%3C/title%3E%3Ctext x='50' y='.9em' font-size='18' text-anchor='middle' fill='%23000'%3EScreeps%3C/text%3E%3C/svg%3E"
        />
      </head>
      <body>
        <header>
          <nav>
            <div class="brand">
              <span class="logo">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 100"
                  aria-label="Screeps Dashboard"
                >
                  <title>Screeps Dashboard</title>
                  <text x="50" y=".9em" fontSize="18" textAnchor="middle" fill="#000">
                    Screeps
                  </text>
                </svg>
              </span>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}