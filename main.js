tsx
// app/layout.tsx - Add aria-label to the SVG favicon
// Line 7 should be updated to include aria-label or aria-hidden

import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:title" content="Title" />
        <meta property="og:description" content="Description" />
        <svg aria-hidden="true" /> {/* or use aria-label="Description" for accessible name */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}