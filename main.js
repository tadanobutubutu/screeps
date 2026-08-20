tsx
// dashboard/app/layout.tsx

import React from 'react';

const Layout: React.FC = () => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Application</title>
        <link rel="icon" href="/path/to/favicon.svg" type="image/svg+xml" aria-hidden="true" />
        {/* ... other head elements ... */}
      </head>
      <body>
        {/* ... content of the page ... */}
      </body>
    </html>
  );
};

export default Layout;