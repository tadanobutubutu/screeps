// Since the issue mentions multiple files and we need to preserve existing code,
// here are the changes needed for each file:

// 1. dashboard/app/layout.tsx
// Wrap the children in a <main> element
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

// 2. docs/dependency-graph.html
// Add <main> around the table
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dependency Graph</title>
    <style>
        /* Existing styles */
    </style>
</head>
<body>
    <main>
        <table id="table-rotated">
            <!-- Existing table content -->
        </table>
    </main>
</body>
</html>

// 3. docs/index.html
// Add <main> around the container div
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality & Metrics Reports</title>
    <style>
        /* Existing styles */
    </style>
</head>
<body>
    <main>
        <div class="container">
            <h2>Quality & Metrics Reports</h2>
            <p>
                This repository is fully optimized with automated tools. Explore the generated
                reports below:
            </p>
            <div class="links">
                <a href="plato-report/index.html">📊 Plato Code Complexity Report</a>
                <a href="dependency-graph.html">🕸️ Dependency Graph (Dependency-Cruiser)</a>
            </div>
        </div>
    </main>
</body>
</html>

// 4. app/layout.tsx
// Wrap the children in a <main> element
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        {/* Existing head content */}
      </head>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}