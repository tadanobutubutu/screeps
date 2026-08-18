tsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Add aria-label or title element to make SVG accessible */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" aria-label="Website icon" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}