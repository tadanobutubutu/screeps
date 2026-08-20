tsx
// Before
import React from 'react';
import favicon from '@/assets/favicon.svg';
import { Helmet } from 'react-helmet';

const Layout = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My App Title</title>
      </Helmet>

      <img src={favicon} alt="My Favicon" />

      {/* Rest of the code */}
    </div>
  );
};

export default Layout;

// After
import React from 'react';
import favicon from '@/assets/favicon.svg';
import { Helmet } from 'react-helmet';

const Layout = () => {
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>My App Title</title>
      </Helmet>

      <img src={favicon} alt="My Favicon" aria-label="My Favicon" />

      {/* Rest of the code */}
    </div>
  );
};

export default Layout;