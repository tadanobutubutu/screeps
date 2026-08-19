import { Html, Head, Main, NextScript } from 'next/document';
import React from 'react';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <main>
          {/* Added in HEAD branch */}
          <link rel="apple-touch-icon" sizes="76x76" href="/favicon/android-icon-76x76.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/favicon/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          {/* End of additions in HEAD branch */}
          <Main />
          <NextScript />
        </main>
      </body>
    </Html>
  );
}
```

This solution incorporates the additional link tags added in the `HEAD` branch by preserving the original structure while incorporating the new links to the favicon files. The tags are placed to ensure they load before the main content (`<Main />`), as they were originally intended.