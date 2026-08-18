// pages/_document.js - Fix for REACT_015 (Language Attribute)
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

The conflict involved two different approaches: a standard React `App` component in `main.js` and a Next.js `_document.js` structure. The Next.js version (origin/main) properly sets the `lang` attribute on the root `<html>` element, which is the correct semantic location for global document attributes. The HEAD version incorrectly placed `lang="en"` on a `<div>`, which only affects that element rather than the entire document. The Next.js approach is more appropriate for React frameworks like Next.js, where document-level attributes should be managed in `_document.js`.