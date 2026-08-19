/**
 * @param {Object} context - Application context
 * @returns {JSX.Element} - Rendered application
 */
export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Application</title>
      </head>
      <body>
        <main>
          <div id="root"></div>
        </main>
      </body>
    </html>
  );
}
```

This resolved the merge conflict by integrating both changes. The original HTML structure was kept, and the requested addition of `<main>` landmark was integrated to maintain accessibility compliance for the project.